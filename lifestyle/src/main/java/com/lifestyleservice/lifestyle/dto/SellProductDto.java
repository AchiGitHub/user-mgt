package com.lifestyleservice.lifestyle.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class SellProductDto {
    private UUID id;
    private Integer quantity;
}
