package com.lifestyleservice.lifestyle.repository;

import com.lifestyleservice.lifestyle.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, UUID> {

    @Query("select r from Registration r where year(r.endDate) = ?1 and month(r.endDate) = ?2")
    List<Registration> findAllExpireByEndDate(Integer year, Integer month);
}
