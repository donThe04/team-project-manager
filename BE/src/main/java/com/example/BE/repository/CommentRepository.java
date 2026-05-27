package com.example.BE.repository;

import com.example.BE.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Lấy danh sách comment của task, mới nhất lên trên
    List<Comment> findByTaskIdOrderByCreatedAtDesc(Long taskId);

    // Đếm số comment của task
    long countByTaskId(Long taskId);

    // Lấy comment kèm thông tin user (tránh N+1)
    @Query("""
        SELECT c FROM Comment c
        JOIN FETCH c.user
        WHERE c.task.id = :taskId
        ORDER BY c.createdAt DESC
    """)
    List<Comment> findByTaskIdWithUser(@Param("taskId") Long taskId);

    // Kiểm tra comment có thuộc về user không (trước khi cho sửa/xoá)
    boolean existsByIdAndUserId(Long commentId, Long userId);
}
