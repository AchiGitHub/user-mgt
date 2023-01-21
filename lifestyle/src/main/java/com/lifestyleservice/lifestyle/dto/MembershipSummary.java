package com.lifestyleservice.lifestyle.dto;

import com.lifestyleservice.lifestyle.entity.MembershipType;
import lombok.Data;

@Data
public class MembershipSummary {
    private MembershipType membershipType;
    private Integer count;
}
