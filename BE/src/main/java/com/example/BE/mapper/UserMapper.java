package com.example.BE.mapper;

import com.example.BE.dto.request.UserCreationRequest;
import com.example.BE.dto.request.UserUpdateRequest;
import com.example.BE.dto.response.UserResponse;
import com.example.BE.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
