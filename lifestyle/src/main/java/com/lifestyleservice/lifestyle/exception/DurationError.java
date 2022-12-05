package com.lifestyleservice.lifestyle.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class DurationError extends RuntimeException{
    private final String name;
}
