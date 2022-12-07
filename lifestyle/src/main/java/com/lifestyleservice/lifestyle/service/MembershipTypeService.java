package com.lifestyleservice.lifestyle.service;

import com.lifestyleservice.lifestyle.entity.MembershipType;
import com.lifestyleservice.lifestyle.util.TransportDto;

import java.util.UUID;

public interface MembershipTypeService {
    TransportDto createMembershipType(MembershipType membershipType);
    TransportDto getAllMembershipTypes();
    boolean deleteMembershipType(UUID id);
    TransportDto updateMembershipType(UUID id, MembershipType membershipType);
    TransportDto getMembershipTypeById(UUID id);
}
