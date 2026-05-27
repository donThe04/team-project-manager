package com.example.BE.repository;

import com.example.BE.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Lấy tất cả project mà user là owner
    List<Project> findByOwnerId(Long ownerId);

    // Lấy tất cả project mà user tham gia (cả owner lẫn member)
    @Query("""
        SELECT DISTINCT p FROM Project p
        JOIN ProjectMember pm ON pm.project.id = p.id
        WHERE pm.user.id = :userId
        ORDER BY p.createdAt DESC
    """)
    List<Project> findAllProjectsByUserId(@Param("userId") Long userId);

    // Kiểm tra user có thuộc project không
    @Query("""
        SELECT COUNT(pm) > 0 FROM ProjectMember pm
        WHERE pm.project.id = :projectId
        AND pm.user.id = :userId
    """)
    boolean isUserInProject(@Param("projectId") Long projectId,
                            @Param("userId") Long userId);
}
