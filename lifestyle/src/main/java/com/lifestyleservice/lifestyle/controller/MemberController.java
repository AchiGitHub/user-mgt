package com.lifestyleservice.lifestyle.controller;

import com.lifestyleservice.lifestyle.dto.MemberDto;
import com.lifestyleservice.lifestyle.entity.Member;
import com.lifestyleservice.lifestyle.service.MemberService;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/member")
@Slf4j
public class MemberController {

    private MemberService memberService;
    private ModelMapper modelMapper;

    @Autowired
    private MemberController(MemberService memberService, ModelMapper modelMapper) {
        this.memberService = memberService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("")
    public ResponseEntity<Member> createMember(@RequestBody MemberDto memberDto) {
        Member createMember = modelMapper.map(memberDto, Member.class);
        LocalDateTime now = LocalDateTime.now();
        createMember.setCreatedDate(now);
        createMember.setLastModifiedDate(now);
        createMember.setLastModifiedBy("ADMIN");
        createMember.setCreatedBy("ADMIN");
        createMember.setDob(memberDto.getDob());

        TransportDto member = memberService.createMember(createMember);
        log.info("Member created {}", createMember);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(member.getResponse())
                .toUri();
        return ResponseEntity.created(location).build();
    }

    @GetMapping("")
    public ResponseEntity getAllMembers() {
        TransportDto res = memberService.getAllMembers();
        if (res.getError() != null) {
            return ResponseEntity.status(res.getError().getStatus()).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/list")
    public ResponseEntity<TransportDto> getMembersByIds(@RequestBody List<UUID> ids) {
        TransportDto users = memberService.getMembersByIdList(ids);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransportDto> updateMember(@PathVariable UUID id, @RequestBody Member member) {
        TransportDto updatedMember = memberService.updateMember(id, member);
        return ResponseEntity.ok(updatedMember);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransportDto> getMember(@PathVariable UUID id) {
        TransportDto res = memberService.getMember(id);
        if (res.getError() != null) {
            return ResponseEntity.status(res.getError().getStatus()).body(res);
        }
        return ResponseEntity.ok(memberService.getMember(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable UUID id) {
        TransportDto res = memberService.deleteMember(id);
        if (res.getError() != null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found!");
        } else {
            return ResponseEntity.ok().body("Member deleted successfully!");
        }
    }
}
