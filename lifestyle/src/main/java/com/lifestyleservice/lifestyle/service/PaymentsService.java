package com.lifestyleservice.lifestyle.service;

import com.lifestyleservice.lifestyle.entity.Payments;
import com.lifestyleservice.lifestyle.util.TransportDto;

import java.util.UUID;

public interface PaymentsService {
    TransportDto createPayment(Payments payment);
    TransportDto getAllPayments();
    TransportDto getPaymentByRegistrationId(UUID id);
}
