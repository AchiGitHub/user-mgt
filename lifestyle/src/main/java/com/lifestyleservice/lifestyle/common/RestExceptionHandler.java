package com.lifestyleservice.lifestyle.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Arrays;

@ControllerAdvice
@Slf4j
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    protected ResponseEntity<Object> buildResponseEntity(ApiError apiError) {
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String error = "Invalid request. Please contact support";
        log.error("Exception in the request. request: {}, ex: {}", request.getContextPath(), ex.getLocalizedMessage());
        log.debug("Exception in the request. request: {}, ex: {}", request, Arrays.toString(ex.getStackTrace()));
        return buildResponseEntity(ApiError.builder().status(HttpStatus.BAD_REQUEST).message("Parameters not matching").build());
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String error = "Invalid request. Please contact support";
        log.error("Exception in the request. request: {}, ex: {}", request.getContextPath(), ex.getLocalizedMessage());
        log.debug("Exception in the request. request: {}, ex: {}", request, Arrays.toString(ex.getStackTrace()));
        return buildResponseEntity(ApiError.builder().status(HttpStatus.BAD_REQUEST).message("Parameters not matching").build());
    }
}
