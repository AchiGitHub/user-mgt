package com.lifestyleservice.lifestyle.service;

import com.lifestyleservice.lifestyle.entity.Duration;
import com.lifestyleservice.lifestyle.util.TransportDto;

import java.util.UUID;

public interface DurationService {
    TransportDto getDurations();
    TransportDto createDuration(Duration duration);
    TransportDto editDuration(UUID id, Duration duration);
    boolean deleteDuration(UUID id);
}
