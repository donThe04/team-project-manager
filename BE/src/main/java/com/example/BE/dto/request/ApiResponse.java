package com.example.BE.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL) // cai nao null thi khong can hien thi trong json tra ve
public class ApiResponse<T> { //chua tat cac cac file ma minh muon chuan hoa
    int code = 1000;
    String message;
    T result; // do kieu tra ve co the thay doi tuy thuoc vao cac api
}