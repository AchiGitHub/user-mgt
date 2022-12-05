package com.lifestyleservice.lifestyle.service.impl;

import com.lifestyleservice.lifestyle.entity.Member;
import com.lifestyleservice.lifestyle.repository.MemberRepository;
import com.lifestyleservice.lifestyle.service.MemberService;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MemberServiceImpl implements MemberService {

    private MemberRepository memberRepository;
    private RequestHelper requestHelper;

    @Autowired
    private MemberServiceImpl(MemberRepository memberRepository, RequestHelper requestHelper) {
        this.memberRepository = memberRepository;
        this.requestHelper = requestHelper;
    }

    @Override
    public TransportDto createMember(Member member) {
        memberRepository.save(member);
        return requestHelper.setResponse(member);
    }

    @Override
    public TransportDto updateMember(UUID id, Member member) {
        try {
            Member updateMember = memberRepository.findById(id).get();
            memberRepository.save(member);
            return requestHelper.setResponse(updateMember);
        } catch (Exception e) {
            return requestHelper.setError(HttpStatus.NOT_FOUND, "Member not found!");
        }
    }

    @Override
    public TransportDto deleteMember(UUID id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member != null) {
            memberRepository.deleteById(id);
            return requestHelper.setResponse(id + " delete successfully");
        } else {
            return requestHelper.setError(HttpStatus.NOT_FOUND,id + " not found!");
        }
    }

    @Override
    public TransportDto getAllMembers() {
        List<Member> allMembers = memberRepository.findAll();
        return requestHelper.setResponse(allMembers);
    }

    @Override
    public TransportDto getMember(UUID id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member == null) {
            return requestHelper.setError(HttpStatus.NOT_FOUND, "Member not found!");
        }
        return requestHelper.setResponse(member);
    }

    @Override
    public TransportDto getMembersByIdList(List<UUID> ids) {
        List<Member> members = memberRepository.findByIdIn(ids);
        return requestHelper.setResponse(members);
    }
}
