package com.example.BE.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 50)
    private Action action;

    @Column(name = "detail", columnDefinition = "TEXT")
    private String detail;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Action {
        CREATED,        // Tạo task
        UPDATED,        // Cập nhật thông tin task
        MOVED,          // Di chuyển task sang cột khác
        ASSIGNED,       // Assign thành viên
        UNASSIGNED,     // Bỏ assign
        COMMENTED,      // Thêm comment
        ATTACHMENT_ADDED,   // Đính kèm file
        ATTACHMENT_REMOVED, // Xoá file
        DEADLINE_SET,   // Đặt deadline
        PRIORITY_CHANGED,   // Đổi priority
        CHECKLIST_ADDED,    // Thêm checklist
        CHECKLIST_ITEM_DONE // Tick checklist item
    }
}
