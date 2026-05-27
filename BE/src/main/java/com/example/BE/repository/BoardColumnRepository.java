package com.example.BE.repository;

import com.example.BE.entity.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardColumnRepository extends JpaRepository<BoardColumn, Long> {

    // Lấy danh sách cột theo board, sắp xếp theo position
    List<BoardColumn> findByBoardIdOrderByPositionAsc(Long boardId);

    // Tìm position lớn nhất trong board (để thêm cột mới vào cuối)
    @Query("SELECT COALESCE(MAX(c.position), -1) FROM BoardColumn c WHERE c.board.id = :boardId")
    int findMaxPositionByBoardId(@Param("boardId") Long boardId);

    // Cập nhật position của cột (dùng khi kéo thả)
    @Modifying
    @Query("UPDATE BoardColumn c SET c.position = :position WHERE c.id = :columnId")
    void updatePosition(@Param("columnId") Long columnId,
                        @Param("position") int position);

    // Kiểm tra cột có thuộc board không
    boolean existsByIdAndBoardId(Long columnId, Long boardId);

    // Đếm số cột trong board
    long countByBoardId(Long boardId);
}
