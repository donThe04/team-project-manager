package com.example.BE.repository;

import com.example.BE.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Lấy danh sách task theo cột, sắp xếp theo position
    List<Task> findByColumnIdOrderByPositionAsc(Long columnId);

    // Lấy task kèm assignees và comments (tránh N+1)
    @Query("""
        SELECT DISTINCT t FROM Task t
        LEFT JOIN FETCH t.assignees ta
        LEFT JOIN FETCH ta.user
        WHERE t.id = :taskId
    """)
    Optional<Task> findByIdWithAssignees(@Param("taskId") Long taskId);

    // Tìm position lớn nhất trong cột (để thêm task vào cuối)
    @Query("SELECT COALESCE(MAX(t.position), -1) FROM Task t WHERE t.column.id = :columnId")
    int findMaxPositionByColumnId(@Param("columnId") Long columnId);

    // Cập nhật position của task
    @Modifying
    @Query("UPDATE Task t SET t.position = :position WHERE t.id = :taskId")
    void updatePosition(@Param("taskId") Long taskId,
                        @Param("position") int position);

    // Di chuyển task sang cột khác
    @Modifying
    @Query("UPDATE Task t SET t.column.id = :columnId, t.position = :position WHERE t.id = :taskId")
    void moveToColumn(@Param("taskId") Long taskId,
                      @Param("columnId") Long columnId,
                      @Param("position") int position);

    // Tìm kiếm task theo title trong board
    @Query("""
        SELECT t FROM Task t
        JOIN t.column c
        WHERE c.board.id = :boardId
        AND LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
        ORDER BY t.createdAt DESC
    """)
    List<Task> searchByTitleInBoard(@Param("boardId") Long boardId,
                                    @Param("keyword") String keyword);

    // Filter task theo label trong board
    @Query("""
        SELECT t FROM Task t
        JOIN t.column c
        WHERE c.board.id = :boardId
        AND (:label IS NULL OR t.labelColor = :label)
        AND (:assigneeId IS NULL OR EXISTS (
            SELECT ta FROM TaskAssignee ta
            WHERE ta.task.id = t.id AND ta.user.id = :assigneeId
        ))
        AND (:deadline IS NULL OR t.deadline = :deadline)
        ORDER BY t.position ASC
    """)
    List<Task> filterTasks(@Param("boardId") Long boardId,
                           @Param("label") String label,
                           @Param("assigneeId") Long assigneeId,
                           @Param("deadline") LocalDate deadline);

    // Lấy tất cả task sắp đến deadline (dùng cho notification)
    @Query("SELECT t FROM Task t WHERE t.deadline = :date")
    List<Task> findTasksDueOn(@Param("date") LocalDate date);

    // Lấy tất cả task trong board (dùng khi load toàn bộ board)
    @Query("""
        SELECT t FROM Task t
        JOIN t.column c
        WHERE c.board.id = :boardId
        ORDER BY c.position ASC, t.position ASC
    """)
    List<Task> findAllByBoardId(@Param("boardId") Long boardId);
}
