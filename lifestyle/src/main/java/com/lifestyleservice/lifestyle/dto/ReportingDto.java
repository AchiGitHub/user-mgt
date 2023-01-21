package com.lifestyleservice.lifestyle.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
public class ReportingDto {
    private Integer numberOfRegistrations;
    private Integer expiringRegistrations;
    private Double totalMembershipPayments;
    private Double totalBeverageSales;
    private List<MembershipSummary> membershipSummary;
}
