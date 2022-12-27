package com.lifestyleservice.lifestyle.controller;

import com.lifestyleservice.lifestyle.service.TokenServiceImpl;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
@Slf4j
@RequestMapping("/v1/auth")
public class AuthController {

    private final TokenServiceImpl tokenService;
    private final RequestHelper requestHelper;

    @Autowired
    public AuthController(TokenServiceImpl tokenService, RequestHelper requestHelper) {
        this.requestHelper = requestHelper;
        this.tokenService = tokenService;
    }

    @PostMapping("/token")
    public ResponseEntity<Object> token(Authentication authentication) {
        log.debug("Token requested for user: '{}'", authentication.getName());
        String token = tokenService.generateToken(authentication);
        log.debug("Token granted: {}", token);
        TransportDto res = requestHelper.setResponse(token);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(res);
    }

}