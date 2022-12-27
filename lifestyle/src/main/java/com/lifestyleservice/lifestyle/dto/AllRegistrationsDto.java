package com.lifestyleservice.lifestyle.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lifestyleservice.lifestyle.entity.Member;
import com.lifestyleservice.lifestyle.entity.MembershipType;
import com.lifestyleservice.lifestyle.enums.PaymentTypes;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Getter
@Setter
public class AllRegistrationsDto {
    private UUID id;
    @NotNull
    private String name;
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime startDate;
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime endDate;
    @NotNull
    private List<Optional<Member>> users;
    @NotNull
    private Double amount;
    @NotNull
    private Optional<MembershipType> membershipType;
    @NotNull
    private PaymentTypes paymentType;
    @NotNull
    private Double paymentAmount;
}
