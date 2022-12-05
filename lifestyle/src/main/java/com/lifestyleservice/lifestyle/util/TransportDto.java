package com.lifestyleservice.lifestyle.util;

import com.lifestyleservice.lifestyle.common.ApiError;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransportDto {
    private ApiError error;
    private Object response;
}
