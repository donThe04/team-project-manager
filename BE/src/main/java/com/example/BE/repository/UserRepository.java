package com.example.BE.repository;

import com.example.BE.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Tìm user theo email (dùng cho login)
    Optional<User> findByEmail(String email);

    // Tìm user theo username
    Optional<User> findByUsername(String username);

    // Kiểm tra email đã tồn tại chưa (dùng khi register)
    boolean existsByEmail(String email);

    // Kiểm tra username đã tồn tại chưa
    boolean existsByUsername(String username);

    // Tìm user theo email hoặc username
    Optional<User> findByEmailOrUsername(String email, String username);

    // Tìm kiếm user theo email để invite vào project
    @Query("SELECT u FROM User u WHERE u.email LIKE %:keyword% OR u.username LIKE %:keyword%")
    List<User> searchByEmailOrUsername(@Param("keyword") String keyword);
}
