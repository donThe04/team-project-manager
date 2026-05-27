package com.example.BE.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class UserCreationRequest {
    @Size(min = 3, message = "USERNAME_INVALID")
    String id;
    String username;
    @Size(min = 8, message = "PASSWORD_INVALID")
    String passwordHash;
    String email;
}
