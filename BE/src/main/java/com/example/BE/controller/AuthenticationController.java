package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.AuthenticationRequest;
import com.example.BE.dto.request.IntrospectRequest;
import com.example.BE.dto.response.AuthenticationResponse;
import com.example.BE.dto.response.IntrospectResponse;
import com.example.BE.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        var result = authenticationService.authenticate(request);
        return  ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws JOSEException, ParseException
    {
        var result = authenticationService.introspect(request);
        return  ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }
}
