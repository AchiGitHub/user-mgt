package com.lifestyleservice.lifestyle.service.impl;

import com.lifestyleservice.lifestyle.dto.MembershipTypeDto;
import com.lifestyleservice.lifestyle.entity.Duration;
import com.lifestyleservice.lifestyle.entity.MembershipType;
import com.lifestyleservice.lifestyle.repository.DurationRepository;
import com.lifestyleservice.lifestyle.repository.MembershipRepository;
import com.lifestyleservice.lifestyle.service.MembershipTypeService;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class MembershipTypeServiceImpl implements MembershipTypeService {

    private MembershipRepository membershipRepository;
    private DurationRepository durationRepository;
    private RequestHelper requestHelper;

    @Autowired
    public MembershipTypeServiceImpl(MembershipRepository membershipRepository, RequestHelper requestHelper, DurationRepository durationRepository) {
        this.membershipRepository = membershipRepository;
        this.requestHelper = requestHelper;
        this.durationRepository = durationRepository;
    }

    @Override
    public TransportDto createMembershipType(MembershipType membershipType) {
        membershipRepository.save(membershipType);
        TransportDto membershipTypeDto = requestHelper.setResponse(membershipType);
        return membershipTypeDto;
    }

    @Override
    public TransportDto getAllMembershipTypes() {
        List<MembershipType> membershipTypes = membershipRepository.findAll();
        List<MembershipTypeDto> membershipTypeDto = new ArrayList<>();

        membershipTypes.forEach(membershipType -> {
            MembershipTypeDto data = new MembershipTypeDto();
            UUID durationId = membershipType.getDurationId();
            Optional<Duration> duration = durationRepository.findById(durationId);
            data.setMembershipName(membershipType.getMembershipName());
            data.setPrice(membershipType.getPrice());
            data.setId(membershipType.getId());
            data.setDuration(duration);
            data.setNumberOfMembers(membershipType.getNumberOfMembers());
            membershipTypeDto.add(data);
        });

        if (membershipTypeDto == null) {
            return requestHelper.setError(HttpStatus.NOT_FOUND, "No membership types available!");
        }
        return requestHelper.setResponse(membershipTypeDto);
    }

    @Override
    public boolean deleteMembershipType(UUID id) {
        try {
            membershipRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public TransportDto updateMembershipType(UUID id, MembershipType updateMembershipType) {
        try {
            MembershipType membership = membershipRepository.findById(id).get();
            String membershipName = updateMembershipType.getMembershipName();
            Long numOfMembers = updateMembershipType.getNumberOfMembers();
            Long price = updateMembershipType.getPrice();
            UUID duration = updateMembershipType.getDurationId();

            if (Objects.nonNull(membershipName)
                    && !"".equalsIgnoreCase(membershipName)) {
                membership.setMembershipName(membershipName);
            }
            if (Objects.nonNull(numOfMembers)) {
                membership.setNumberOfMembers(numOfMembers);
            }
            if (Objects.nonNull(price)) {
                membership.setPrice(price);
            }
            if (Objects.nonNull(duration)) {
                membership.setDurationId(duration);
            }
            membershipRepository.save(membership);
            return requestHelper.setResponse(membership);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Membership type not found!", e);
        }
    }

    @Override
    public TransportDto getMembershipTypeById(UUID id) {
        MembershipType membershipType = membershipRepository.findById(id).get();
        return requestHelper.setResponse(membershipType);
    }
}
