package com.lifestyleservice.lifestyle.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllActiveRegistrationsDto {
    private List<AllRegistrationsDto> content;
    private int pageNo;
    private long totalElements;
    private int totalPages;
}
