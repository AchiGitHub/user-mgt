package com.lifestyleservice.lifestyle.repository;

import com.lifestyleservice.lifestyle.entity.Payments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentsRepository extends JpaRepository<Payments, UUID> {
    List<Payments> findAllByRegistrationId(UUID id);
}
