package com.lifestyleservice.lifestyle.service;

import com.lifestyleservice.lifestyle.entity.Member;
import com.lifestyleservice.lifestyle.util.TransportDto;

import java.util.List;
import java.util.UUID;

public interface MemberService {
    TransportDto createMember(Member member);
    TransportDto updateMember(UUID id, Member member);
    TransportDto deleteMember(UUID id);
    TransportDto getAllMembers();
    TransportDto getMember(UUID id);
    TransportDto getMembersByIdList(List<UUID> ids);
}
