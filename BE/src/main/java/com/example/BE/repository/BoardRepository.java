package com.example.BE.repository;

import com.example.BE.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    // Lấy danh sách board theo project
    List<Board> findByProjectIdOrderByCreatedAtAsc(Long projectId);

    // Lấy board kèm theo columns và tasks (tránh N+1 query)
    @Query("""
        SELECT DISTINCT b FROM Board b
        LEFT JOIN FETCH b.columns c
        WHERE b.id = :boardId
        ORDER BY c.position ASC
    """)
    Optional<Board> findByIdWithColumns(@Param("boardId") Long boardId);

    // Kiểm tra board có thuộc project không
    boolean existsByIdAndProjectId(Long boardId, Long projectId);

    // Đếm số board trong project
    long countByProjectId(Long projectId);
}
