package com.example.BE.repository;

import com.example.BE.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    // Lấy danh sách thành viên của project
    List<ProjectMember> findByProjectId(Long projectId);

    // Tìm membership của 1 user trong 1 project (để check quyền)
    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    // Kiểm tra user đã là thành viên chưa
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    // Xoá thành viên khỏi project
    void deleteByProjectIdAndUserId(Long projectId, Long userId);

    // Đếm số thành viên trong project
    long countByProjectId(Long projectId);
}
