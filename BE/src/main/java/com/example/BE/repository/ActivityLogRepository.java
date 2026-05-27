package com.example.BE.repository;

import com.example.BE.entity.ActivityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    // Lấy activity log của task, mới nhất lên trên
    List<ActivityLog> findByTaskIdOrderByCreatedAtDesc(Long taskId);

    // Lấy activity log của task có phân trang
    @Query("""
        SELECT a FROM ActivityLog a
        JOIN FETCH a.user
        WHERE a.task.id = :taskId
        ORDER BY a.createdAt DESC
    """)
    List<ActivityLog> findByTaskIdWithUser(@Param("taskId") Long taskId,
                                           Pageable pageable);

    // Lấy activity log gần đây nhất của board (dùng cho dashboard)
    @Query("""
        SELECT a FROM ActivityLog a
        JOIN FETCH a.user
        JOIN a.task t
        JOIN t.column c
        WHERE c.board.id = :boardId
        ORDER BY a.createdAt DESC
    """)
    List<ActivityLog> findRecentByBoardId(@Param("boardId") Long boardId,
                                          Pageable pageable);
}
