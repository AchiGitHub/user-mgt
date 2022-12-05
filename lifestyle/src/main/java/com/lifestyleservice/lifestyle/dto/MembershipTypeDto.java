package com.lifestyleservice.lifestyle.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lifestyleservice.lifestyle.entity.Duration;
import com.lifestyleservice.lifestyle.enums.DurationType;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Getter
@Setter
public class MembershipTypeDto {
    private UUID id;
    @NotNull
    private String membershipName;
    @NotNull
    private Long price;
    @NotNull
    private Long numberOfMembers;
    @NotNull
    private Optional<Duration> duration;
}
