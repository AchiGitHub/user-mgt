package com.lifestyleservice.lifestyle.service.impl;

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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class RegisterServiceImpl implements RegistrationService {

    private RegistrationRepository registrationRepository;
    private RequestHelper requestHelper;
    private MemberRepository memberRepository;
    private MembershipRepository membershipRepository;
    private ModelMapper modelMapper;
    private MemberService memberService;
    private PaymentsService paymentsService;

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
                AllRegistrationsDto newObj = new AllRegistrationsDto();
                newObj.setId(reg.getId());
                Optional<MembershipType> mt = membershipRepository.findById(reg.getMembershipType());
                List<Optional<Member>> members = new ArrayList<>();
                reg.getUsers().forEach(member -> {
                    Optional<Member> getMem = memberRepository.findById(member);
                    members.add(getMem);
                });
                newObj.setAmount(reg.getAmount());
                newObj.setName(reg.getName());
                newObj.setEndDate(reg.getEndDate());
                newObj.setStartDate(reg.getStartDate());
                newObj.setUsers(members);
                newObj.setMembershipType(mt);
                regs.add(newObj);
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
        } catch(Exception e) {
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
            // Create members for the registration
            // User ids for
            List<UUID> userIds = new ArrayList<UUID>();
            List<Member> members = registerUserDto.getUsers();
            for(int i = 0; i < members.size(); i++) {
                if (members.get(i).getFirstName() != "") {
                    Member model = modelMapper.map(members.get(i), Member.class);
                    TransportDto member = memberService.createMember(model);
                    Member createdMember = (Member) member.getResponse();
                    userIds.add(createdMember.getId());
                }
            }
            // Create registration
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
            // Save new registration
            Registration reg = registrationRepository.save(registration);

            // Create Payment record
            Payments payment = new Payments();
            payment.setPaymentType(registerUserDto.getPaymentType());
            payment.setAmount(registerUserDto.getAmount());
            payment.setRegistrationId(reg.getId());
            payment.setCreatedBy("SYSTEM");
            payment.setLastModifiedBy("SYSTEM");
            payment.setCreatedDate(LocalDateTime.now());
            payment.setLastModifiedDate(LocalDateTime.now());
            payment.setCategory("Membership Fees");

            paymentsService.createPayment(payment);

            return requestHelper.setResponse(registerUserDto);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration failed!");
        }
    }
}
