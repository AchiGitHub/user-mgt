package com.lifestyleservice.lifestyle.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lifestyleservice.lifestyle.enums.DurationType;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class DurationDto {
    private UUID id;
    @NotNull
    private DurationType durationType;
    @NotNull
    private Long duration;
}
