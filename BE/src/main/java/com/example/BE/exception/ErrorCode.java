package com.example.BE.exception;

public enum ErrorCode {
    INVALID_KEY(1000, "Invalid message key"),
    USER_NOT_FOUND(1001, "User not found"),
    USER_UPDATE_FAILED(1002, "Update user failed"),
    USER_DELETE_FAILED(1003, "Delete user failed"),
    USER_ALREADY_EXISTS(1004, "User already exists"),
    PASSWORD_INVALID(1005, "Password must be at least 8 characters"),
    USERNAME_INVALID(1006, "Username must be at least 3 characters"),
    AUTHOR_INVALID(1007, "Author must be at least 3 characters"),
    USER_NOT_EXISTED(1008, "User not existed"),
    UNAUTHENTICATED(1009, "Unauthenticated");

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    private int code;
    private String message;


    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
