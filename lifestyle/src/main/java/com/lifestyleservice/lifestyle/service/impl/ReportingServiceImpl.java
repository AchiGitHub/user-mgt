package com.lifestyleservice.lifestyle.service.impl;

import com.lifestyleservice.lifestyle.dto.MembershipSummary;
import com.lifestyleservice.lifestyle.dto.ReportingDto;
import com.lifestyleservice.lifestyle.entity.MembershipType;
import com.lifestyleservice.lifestyle.entity.Payments;
import com.lifestyleservice.lifestyle.entity.Registration;
import com.lifestyleservice.lifestyle.enums.ProductType;
import com.lifestyleservice.lifestyle.repository.MembershipRepository;
import com.lifestyleservice.lifestyle.repository.PaymentsRepository;
import com.lifestyleservice.lifestyle.repository.RegistrationRepository;
import com.lifestyleservice.lifestyle.service.ReportingService;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReportingServiceImpl implements ReportingService {

    private RegistrationRepository registrationRepository;
    private RequestHelper requestHelper;
    private PaymentsRepository paymentsRepository;
    private MembershipRepository membershipRepository;

    @Autowired
    public ReportingServiceImpl(
            RegistrationRepository registrationRepository,
            RequestHelper requestHelper,
            PaymentsRepository paymentsRepository,
            MembershipRepository membershipRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.requestHelper = requestHelper;
        this.paymentsRepository = paymentsRepository;
        this.membershipRepository = membershipRepository;
    }

    @Override
    public TransportDto getReport(String startDate, String endDate) {
        List<Registration> registrations = registrationRepository.findAll();
        List<Payments> payments = paymentsRepository.findAll();

        // Get current month for comparison
        Month currentMonth = LocalDateTime.now().getMonth();

        // Calculate registrations and expiring registrations
        long numberOfRegistrations = registrations.stream()
                .filter(r -> r.getStartDate().getMonth() == currentMonth)
                .peek(r -> System.out.println(r.getName()))
                .count();

        long numberOfExpiringRegistrations = registrations.stream()
                .filter(r -> r.getEndDate().getMonth() == currentMonth)
                .count();

        // Calculate payments totals
        double paymentTotal = payments.stream()
                .filter(p -> p.getCreatedDate() != null && p.getCreatedDate().getMonth() == currentMonth)
                .mapToDouble(p -> {
                    if ("Membership Fees".equals(p.getCategory())) {
                        return p.getAmount();
                    } else if (p.getCategory() != null && p.getCategory().equalsIgnoreCase(ProductType.BEVERAGE.name())) {
                        log.info("Beverage");
                        return 0;
                    } else {
                        return p.getAmount();
                    }
                })
                .sum();

        double beverageTotalSales = payments.stream()
                .filter(p -> p.getCreatedDate() != null && p.getCreatedDate().getMonth() == currentMonth)
                .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(ProductType.BEVERAGE.name()))
                .mapToDouble(Payments::getAmount)
                .sum();

        // Parse date range for membership summary
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        // Get summary of registration types
        List<String[]> res = registrationRepository.findAllByMembershipType(start, end);
        List<MembershipSummary> registrationsSummary = new ArrayList<>();

        if (!res.isEmpty()) {
            registrationsSummary = res.stream()
                    .map(obj -> {
                        System.out.println(obj);
                        MembershipSummary membershipSummary = new MembershipSummary();
                        membershipSummary.setMembershipType(membershipRepository.findById(UUID.fromString(obj[0])).orElse(null));
                        membershipSummary.setCount(Integer.valueOf(obj[1]));
                        return membershipSummary;
                    })
                    .collect(Collectors.toList());
        }

        // Prepare the reporting DTO
        ReportingDto reportingDto = new ReportingDto();
        reportingDto.setNumberOfRegistrations((int) numberOfRegistrations);
        reportingDto.setExpiringRegistrations((int) numberOfExpiringRegistrations);
        reportingDto.setTotalMembershipPayments(paymentTotal);
        reportingDto.setTotalBeverageSales(beverageTotalSales);
        reportingDto.setMembershipSummary(registrationsSummary);

        return requestHelper.setResponse(reportingDto);
    }

}
