package com.lifestyleservice.lifestyle.repository;

import com.lifestyleservice.lifestyle.entity.Duration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DurationRepository extends JpaRepository<Duration, UUID> {
}
