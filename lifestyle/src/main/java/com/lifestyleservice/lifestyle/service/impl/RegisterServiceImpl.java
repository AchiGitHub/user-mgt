package com.lifestyleservice.lifestyle.service.impl;

import com.lifestyleservice.lifestyle.dto.AllActiveRegistrationsDto;
import com.lifestyleservice.lifestyle.dto.AllRegistrationsDto;
import com.lifestyleservice.lifestyle.dto.GetRegistrationsDto;
import com.lifestyleservice.lifestyle.dto.RegisterUserDto;
import com.lifestyleservice.lifestyle.entity.Member;
import com.lifestyleservice.lifestyle.entity.MembershipType;
import com.lifestyleservice.lifestyle.entity.Payments;
import com.lifestyleservice.lifestyle.entity.Registration;
import com.lifestyleservice.lifestyle.repository.MemberRepository;
import com.lifestyleservice.lifestyle.repository.MembershipRepository;
import com.lifestyleservice.lifestyle.repository.RegistrationRepository;
import com.lifestyleservice.lifestyle.service.MemberService;
import com.lifestyleservice.lifestyle.service.PaymentsService;
import com.lifestyleservice.lifestyle.service.RegistrationService;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RegisterServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final RequestHelper requestHelper;
    private final MemberRepository memberRepository;
    private final MembershipRepository membershipRepository;
    private final ModelMapper modelMapper;
    private final MemberService memberService;
    private final PaymentsService paymentsService;

    @Autowired
    public RegisterServiceImpl(RegistrationRepository registrationRepository,
                               RequestHelper requestHelper,
                               MemberRepository memberRepository,
                               MembershipRepository membershipRepository,
                               ModelMapper modelMapper,
                               MemberService memberService,
                               PaymentsService paymentsService
    ) {
        this.registrationRepository = registrationRepository;
        this.requestHelper = requestHelper;
        this.memberRepository = memberRepository;
        this.membershipRepository = membershipRepository;
        this.modelMapper = modelMapper;
        this.memberService = memberService;
        this.paymentsService = paymentsService;
    }

    @Override
    public TransportDto createRegistration(Registration register) {
        Object reg = registrationRepository.save(register);
        TransportDto registration = requestHelper.setResponse(reg);
        return registration;
    }

    @Override
    public TransportDto getAllRegistrations() {

        List<Registration> allRegistrations = registrationRepository.findAll();
        List<GetRegistrationsDto> allRegistrationsDto = new ArrayList<>();
        if (allRegistrations != null) {
            List<AllRegistrationsDto> regs = new ArrayList<>();
            allRegistrations.forEach(reg -> {
                if (reg.getEndDate().isAfter(LocalDateTime.now())) {
                    AllRegistrationsDto newObj = new AllRegistrationsDto();
                    newObj.setId(reg.getId());
                    Optional<MembershipType> mt = membershipRepository.findById(reg.getMembershipType());
                    List<Member> members = memberRepository.findMembersByIds(reg.getUsers());
                    newObj.setAmount(reg.getAmount());
                    newObj.setName(reg.getName());
                    newObj.setEndDate(reg.getEndDate());
                    newObj.setStartDate(reg.getStartDate());
                    newObj.setUsers(members);
                    newObj.setMembershipType(mt);
                    regs.add(newObj);
                }
            });
            return requestHelper.setResponse(regs);
        } else {
            return requestHelper.setError(HttpStatus.NOT_FOUND, "No records found!");
        }
    }

    @Override
    public TransportDto getRegistration(UUID id) {
        try {
            Optional<Registration> res = registrationRepository.findById(id);
            List<Member> members = memberRepository.findByIdIn(res.get().getUsers());
            GetRegistrationsDto regs = new GetRegistrationsDto();
            regs.setId(res.get().getId());
            regs.setName(res.get().getName());
            regs.setAmount(res.get().getAmount());
            regs.setUsers(members);
            regs.setStartDate(res.get().getStartDate());
            regs.setEndDate(res.get().getEndDate());
            regs.setMembershipType(membershipRepository.findById(res.get().getMembershipType()).get());
            return requestHelper.setResponse(regs);
        } catch (Exception e) {
            log.error("Get registration error {}", e);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found!");
        }
    }

    @Override
    public boolean deleteRegistration(UUID id) {
        try {
            registrationRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found!");
        }
    }

    @Override
    public TransportDto updateRegistration(UUID id, Registration register) {
        Optional<Registration> res = registrationRepository.findById(id);
        if (res != null) {
            registrationRepository.save(register);
            return requestHelper.setResponse(register);
        } else {
            return requestHelper.setError(HttpStatus.NOT_FOUND, "Member for found!");
        }
    }

    @Override
    public TransportDto createNewRegistration(RegisterUserDto registerUserDto) {
        try {
            List<UUID> userIds = new ArrayList<>();
            for (Member member : registerUserDto.getUsers()) {
                if (!member.getFirstName().isEmpty()) {
                    Member createdMember = ((Member) memberService.createMember(modelMapper.map(member, Member.class)).getResponse());
                    userIds.add(createdMember.getId());
                }
            }

            Registration registration = new Registration();
            registration.setAmount(registerUserDto.getAmount());
            registration.setName(registerUserDto.getName());
            registration.setMembershipType(registerUserDto.getMembershipType());
            registration.setStartDate(registerUserDto.getStartDate());
            registration.setEndDate(registerUserDto.getEndDate());
            registration.setCreatedBy("SYSTEM");
            registration.setLastModifiedBy("SYSTEM");
            registration.setCreatedDate(LocalDateTime.now());
            registration.setLastModifiedDate(LocalDateTime.now());
            registration.setUsers(userIds);

            Registration savedRegistration = registrationRepository.save(registration);

            Payments payment = new Payments();
            payment.setPaymentType(registerUserDto.getPaymentType());
            payment.setAmount(registerUserDto.getAmount());
            payment.setRegistrationId(savedRegistration.getId());
            payment.setCreatedBy("SYSTEM");
            payment.setLastModifiedBy("SYSTEM");
            payment.setCreatedDate(LocalDateTime.now());
            payment.setLastModifiedDate(LocalDateTime.now());
            payment.setCategory("Membership Fees");

            paymentsService.createPayment(payment);

            return requestHelper.setResponse(registerUserDto);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration failed!", e);
        }
    }

    @Override
    public TransportDto filterRegistrations(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        LocalDateTime endDate = LocalDateTime.parse(date, formatter);
        List<Registration> expiringRegistrations = registrationRepository.findAllExpireByEndDate(endDate.getYear(), endDate.getMonthValue());
        List<GetRegistrationsDto> allRegistrationsDto = new ArrayList<>();
        if (expiringRegistrations == null || expiringRegistrations.isEmpty()) {
            return requestHelper.setError(HttpStatus.NOT_FOUND, "No records found!");
        }

        List<AllRegistrationsDto> regs = expiringRegistrations.stream().map(reg -> {
            AllRegistrationsDto newObj = new AllRegistrationsDto();
            newObj.setId(reg.getId());
            newObj.setAmount(reg.getAmount());
            newObj.setName(reg.getName());
            newObj.setEndDate(reg.getEndDate());
            newObj.setStartDate(reg.getStartDate());
            newObj.setUsers(memberRepository.findMembersByIds(reg.getUsers()));
            newObj.setMembershipType(Optional.ofNullable(membershipRepository.findById(reg.getMembershipType()).orElse(null)));
            return newObj;
        }).collect(Collectors.toList());

        return requestHelper.setResponse(regs);
    }

    @Override
    public TransportDto findAllActiveRegistrations(int pageNum, UUID filterId) {
        LocalDateTime today = LocalDateTime.now();
        Pageable pageable = PageRequest.of(pageNum, 10);
        Page<Registration> activeRegistrations;
        if (filterId != null) {
            activeRegistrations = registrationRepository.findAllFilteredWithPagination(today, filterId, pageable);
        } else {
            activeRegistrations = registrationRepository.findAllActiveRegistrationsWithPagination(today, pageable);
        }

        List<AllRegistrationsDto> regs = activeRegistrations.getContent().stream()
                .map(reg -> {
                    AllRegistrationsDto newObj = new AllRegistrationsDto();
                    newObj.setId(reg.getId());
                    newObj.setAmount(reg.getAmount());
                    newObj.setName(reg.getName());
                    newObj.setEndDate(reg.getEndDate());
                    newObj.setStartDate(reg.getStartDate());
                    newObj.setUsers(memberRepository.findMembersByIds(reg.getUsers()));
                    newObj.setMembershipType(Optional.ofNullable(membershipRepository.findById(reg.getMembershipType()).orElse(null)));
                    return newObj;
                })
                .collect(Collectors.toList());

        AllActiveRegistrationsDto allActiveRegistrationsDto = new AllActiveRegistrationsDto();
        allActiveRegistrationsDto.setContent(regs);
        allActiveRegistrationsDto.setPageNo(activeRegistrations.getNumber());
        allActiveRegistrationsDto.setTotalPages(activeRegistrations.getTotalPages());
        allActiveRegistrationsDto.setTotalElements(activeRegistrations.getTotalElements());

        return activeRegistrations.isEmpty() ? requestHelper.setError(HttpStatus.NOT_FOUND, "No records found!") :
                requestHelper.setResponse(allActiveRegistrationsDto);
    }

    @Override
    public TransportDto getAllExpiredRegistrations() {
        // Fetch all registrations that have already expired in a single query
        List<Registration> allExpiredRegistrations = registrationRepository.findExpiredRegistrations(LocalDateTime.now());

        if (allExpiredRegistrations.isEmpty()) {
            return requestHelper.setError(HttpStatus.NOT_FOUND, "No records found!");
        }

        // Collecting membership type IDs and user IDs for batch fetching
        Set<UUID> membershipTypeIds = allExpiredRegistrations.stream()
                .map(Registration::getMembershipType) // Assuming this returns the ID
                .collect(Collectors.toSet());

        Set<UUID> userIds = allExpiredRegistrations.stream()
                .flatMap(reg -> reg.getUsers().stream())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Batch fetch all membership types and members
        Map<UUID, MembershipType> membershipTypeMap = membershipRepository.findAllById(membershipTypeIds)
                .stream()
                .collect(Collectors.toMap(MembershipType::getId, mt -> mt));

        List<Member> members = memberRepository.findAllById(userIds);
        Map<UUID, Member> memberMap = members.stream()
                .collect(Collectors.toMap(Member::getId, member -> member));

        // Prepare the DTO list
        List<AllRegistrationsDto> regs = allExpiredRegistrations.stream()
                .map(reg -> {
                    AllRegistrationsDto newObj = new AllRegistrationsDto();
                    newObj.setId(reg.getId());
                    newObj.setAmount(reg.getAmount());
                    newObj.setName(reg.getName());
                    newObj.setEndDate(reg.getEndDate());
                    newObj.setStartDate(reg.getStartDate());

                    // Set users and membership type
                    newObj.setUsers(reg.getUsers().stream()
                            .map(memberMap::get)
                            .collect(Collectors.toList()));

                    newObj.setMembershipType(Optional.ofNullable(membershipTypeMap.get(reg.getMembershipType())));

                    return newObj;
                })
                .collect(Collectors.toList());

        return requestHelper.setResponse(regs);
    }

}
