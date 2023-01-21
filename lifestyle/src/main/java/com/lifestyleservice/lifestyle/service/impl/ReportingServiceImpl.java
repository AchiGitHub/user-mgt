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
import java.time.format.DateTimeFormatter;
import java.util.*;

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
        int numberOfRegistrations = 0;
        int numberOfExpiringRegistrations = 0;
        double paymentTotal = 0;
        double beverageTotalSales = 0;
        // Get all registrations of the month
        for(int i = 0; i < registrations.size(); i++) {
            if (registrations.get(i).getStartDate().getMonth() == LocalDateTime.now().getMonth()) {
                numberOfRegistrations++;
            }
            if (registrations.get(i).getEndDate().getMonth() == LocalDateTime.now().getMonth()) {
                numberOfExpiringRegistrations++;
            }
        }
        // Get all payments total
        for (int i = 0; i < payments.size(); i++) {
            Payments payment = payments.get(i);
            if (payment.getCreatedDate().getMonth() == LocalDateTime.now().getMonth()) {
                log.info(payment.getCategory() + ProductType.BEVERAGE.name());
                if (payment.getCategory() == "Membership Fees") {
                    paymentTotal += payments.get(i).getAmount();
                }
                if (payment.getCategory() != null && payment.getCategory().toUpperCase() == ProductType.BEVERAGE.name().toUpperCase()) {
                    log.info("Beverage");
                    beverageTotalSales += payments.get(i).getAmount();
                }
                if (payment.getCategory() == null) {
                    paymentTotal += payments.get(i).getAmount();
                }
            }
        }

        // Get summary of registration types
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        List<String[]> res = registrationRepository.findAllByMembershipType(start, end);
        List<MembershipSummary> registrationsSummary = new ArrayList();

        if (res.size() != 0) {
            for (int i = 0; i < res.size(); i++) {
                MembershipSummary membershipSummary = new MembershipSummary();
                String[] obj = res.get(i);
                System.out.println(obj[0]);
                Optional<MembershipType> membershipType = membershipRepository.findById(UUID.fromString(obj[0]));
                membershipSummary.setMembershipType(membershipType.get());
                membershipSummary.setCount(Integer.valueOf(obj[1]));
                registrationsSummary.add(membershipSummary);
            }
        }


        ReportingDto reportingDto = new ReportingDto();
        reportingDto.setNumberOfRegistrations(numberOfRegistrations);
        reportingDto.setExpiringRegistrations(numberOfExpiringRegistrations);
        reportingDto.setTotalMembershipPayments(paymentTotal);
        reportingDto.setTotalBeverageSales(beverageTotalSales);
        reportingDto.setMembershipSummary(registrationsSummary);

        return requestHelper.setResponse(reportingDto);
    }
}
