package com.lifestyleservice.lifestyle.service.impl;

import com.lifestyleservice.lifestyle.entity.Payments;
import com.lifestyleservice.lifestyle.entity.Registration;
import com.lifestyleservice.lifestyle.repository.PaymentsRepository;
import com.lifestyleservice.lifestyle.repository.RegistrationRepository;
import com.lifestyleservice.lifestyle.service.ReportingService;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ReportingServiceImpl implements ReportingService {

    private RegistrationRepository registrationRepository;
    private RequestHelper requestHelper;
    private PaymentsRepository paymentsRepository;

    @Autowired
    public ReportingServiceImpl(RegistrationRepository registrationRepository, RequestHelper requestHelper, PaymentsRepository paymentsRepository) {
        this.registrationRepository = registrationRepository;
        this.requestHelper = requestHelper;
        this.paymentsRepository = paymentsRepository;
    }

    @Override
    public TransportDto getReport() {
        List<Registration> registrations = registrationRepository.findAll();
        List<Payments> payments = paymentsRepository.findAll();
        int numberOfRegistrations = 0;
        int numberOfExpiringRegistrations = 0;
        double paymentTotal = 0;
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
            if (payments.get(i).getCreatedDate().getMonth() == LocalDateTime.now().getMonth() && payments.get(i).getCategory() == "Membership Fees") {
                paymentTotal += payments.get(i).getAmount();
            }
        }
        return requestHelper.setResponse(numberOfExpiringRegistrations);
    }
}
