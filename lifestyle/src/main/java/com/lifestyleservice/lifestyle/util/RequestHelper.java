package com.lifestyleservice.lifestyle.util;

import com.lifestyleservice.lifestyle.common.ApiError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RequestHelper {

    public TransportDto setError(HttpStatus status, String message) {
        TransportDto dto = new TransportDto();
        ApiError apiError = new ApiError(status, message);
        apiError.setMessage(message);
        apiError.setStatus(status);
        return dto;
    }

    public TransportDto setResponse(Object response) {
        TransportDto dto = new TransportDto();
        dto.setResponse(response);
        return dto;
    }
}
