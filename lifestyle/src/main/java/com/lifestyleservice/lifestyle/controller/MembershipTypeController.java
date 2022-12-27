package com.lifestyleservice.lifestyle.controller;

import com.lifestyleservice.lifestyle.entity.MembershipType;
import com.lifestyleservice.lifestyle.service.MembershipTypeService;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/v1/membership/type")
@Slf4j
public class MembershipTypeController {
    private MembershipTypeService membershipTypeService;
    private ModelMapper modelMapper;

    @Autowired
    public MembershipTypeController(MembershipTypeService membershipTypeService, ModelMapper modelMapper) {
        this.membershipTypeService = membershipTypeService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("")
    public ResponseEntity<MembershipType> createMembershipType(@RequestBody MembershipType membershipType) {
            MembershipType createMembership = modelMapper.map(membershipType, MembershipType.class);
            LocalDateTime now = LocalDateTime.now();
            createMembership.setCreatedDate(now);
            createMembership.setLastModifiedDate(now);
            createMembership.setLastModifiedBy("ADMIN");
            createMembership.setCreatedBy("ADMIN");

            TransportDto membershipTypeDto = membershipTypeService.createMembershipType(createMembership);
            log.info("Membership Type {}", membershipTypeDto);
            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(membershipTypeDto.getResponse())
                    .toUri();
            return ResponseEntity.created(location).build();
    }

    @GetMapping("")
    public ResponseEntity getMembershipTypes() {
        TransportDto membershipTypes = membershipTypeService.getAllMembershipTypes();
        if (membershipTypes.getError() != null) {
            return ResponseEntity.status(membershipTypes.getError().getStatus()).body(membershipTypes);
        }
        return ResponseEntity.ok(membershipTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity getMembershipTypeById(@PathVariable UUID id) {
        TransportDto membershipType = membershipTypeService.getMembershipTypeById(id);
        if (membershipType.getError() != null) {
            return ResponseEntity.status(membershipType.getError().getStatus()).body(membershipType);
        }
        return ResponseEntity.ok(membershipType);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMembershipType(@PathVariable UUID id) {
        if (!membershipTypeService.deleteMembershipType(id)) {
            throw new IllegalStateException("Duration with id " + id + " doesn't exist!");
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransportDto> updateMembershipType(@PathVariable UUID id,
                                                               @RequestBody MembershipType membershipType)
    {
        TransportDto updatedType = membershipTypeService.updateMembershipType(id, membershipType);
        return ResponseEntity.ok(updatedType);
    }
}
