package com.lifestyleservice.lifestyle.controller;

import com.lifestyleservice.lifestyle.entity.Payments;
import com.lifestyleservice.lifestyle.service.PaymentsService;
import com.lifestyleservice.lifestyle.util.TransportDto;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/v1/payment")
public class PaymentsController {
    private PaymentsService paymentsService;
    private ModelMapper modelMapper;

    public PaymentsController(PaymentsService paymentsService, ModelMapper modelMapper) {
        this.paymentsService = paymentsService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("")
    public ResponseEntity<Object> createPayment(@RequestBody Payments payment) {
        LocalDateTime now = LocalDateTime.now();
        payment.setCreatedBy("ADMIN");
        payment.setCreatedDate(now);
        payment.setLastModifiedBy("ADMIN");
        payment.setLastModifiedDate(now);
        TransportDto createdPayment = paymentsService.createPayment(payment);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdPayment.getResponse())
                .toUri();
        return ResponseEntity.created(location).build();
    }

    @GetMapping("")
    public ResponseEntity getAllPayments() {
        TransportDto allPayments = paymentsService.getAllPayments();
        return ResponseEntity.ok(allPayments);
    }

    @GetMapping("/{id}")
    public ResponseEntity getPaymentByRegistrationId(@PathVariable UUID id) {
        TransportDto payment = paymentsService.getPaymentByRegistrationId(id);
        return ResponseEntity.ok(payment);
    }
}
