package com.example.BE.repository;

import com.example.BE.entity.TaskAssignee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAssigneeRepository extends JpaRepository<TaskAssignee, Long> {

    // Lấy danh sách assignee của task
    List<TaskAssignee> findByTaskId(Long taskId);

    // Tìm assignment cụ thể của 1 user trong 1 task
    Optional<TaskAssignee> findByTaskIdAndUserId(Long taskId, Long userId);

    // Kiểm tra user đã được assign vào task chưa
    boolean existsByTaskIdAndUserId(Long taskId, Long userId);

    // Xoá assign của user khỏi task
    void deleteByTaskIdAndUserId(Long taskId, Long userId);

    // Lấy tất cả task mà user được assign trong 1 board
    @Query("""
        SELECT ta FROM TaskAssignee ta
        JOIN ta.task t
        JOIN t.column c
        WHERE c.board.id = :boardId
        AND ta.user.id = :userId
    """)
    List<TaskAssignee> findByBoardIdAndUserId(@Param("boardId") Long boardId,
                                              @Param("userId") Long userId);
}
