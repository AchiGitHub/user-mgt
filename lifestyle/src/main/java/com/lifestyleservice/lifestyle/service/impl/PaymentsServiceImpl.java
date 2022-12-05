package com.lifestyleservice.lifestyle.service.impl;

import com.lifestyleservice.lifestyle.entity.Payments;
import com.lifestyleservice.lifestyle.repository.PaymentsRepository;
import com.lifestyleservice.lifestyle.repository.RegistrationRepository;
import com.lifestyleservice.lifestyle.service.PaymentsService;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class PaymentsServiceImpl implements PaymentsService {
    private PaymentsRepository paymentsRepository;
    private RequestHelper requestHelper;
    private RegistrationRepository registrationRepository;

    public PaymentsServiceImpl(PaymentsRepository paymentsRepository, RequestHelper requestHelper, RegistrationRepository registrationRepository) {
        this.paymentsRepository = paymentsRepository;
        this.requestHelper = requestHelper;
        this.registrationRepository = registrationRepository;
    }

    @Override
    public TransportDto createPayment(Payments payment) {
        Object savedPayment = paymentsRepository.save(payment);
        log.info("Payment {}", savedPayment);
        TransportDto createPayment = requestHelper.setResponse(payment);
        return createPayment;
    }

    @Override
    public TransportDto getAllPayments() {
        List<Payments> payments = paymentsRepository.findAll();

        return requestHelper.setResponse(payments);
    }

    @Override
    public TransportDto getPaymentByRegistrationId(UUID id) {
        List<Payments> records = paymentsRepository.findAllByRegistrationId(id);
        return requestHelper.setResponse(records);
    }
}
