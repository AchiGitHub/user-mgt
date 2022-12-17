package com.lifestyleservice.lifestyle.entity;

import com.lifestyleservice.lifestyle.enums.PaymentTypes;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payments")
public class Payments extends Auditable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @NotNull
    private UUID registrationId;
    @NotNull
    private Double amount;
    @NotNull
    private PaymentTypes paymentType;
    @NotNull
    private String category;
}
