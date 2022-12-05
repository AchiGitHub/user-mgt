package com.lifestyleservice.lifestyle.service.impl;

import com.lifestyleservice.lifestyle.dto.DurationDto;
import com.lifestyleservice.lifestyle.entity.Duration;
import com.lifestyleservice.lifestyle.repository.DurationRepository;
import com.lifestyleservice.lifestyle.service.DurationService;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DurationServiceImpl implements DurationService {

    private DurationRepository durationRepository;
    private RequestHelper requestHelper;

    @Autowired
    public DurationServiceImpl(DurationRepository durationRepository, RequestHelper requestHelper) {
        this.durationRepository = durationRepository;
        this.requestHelper = requestHelper;
    }

    @Override
    public TransportDto getDurations() {
        List<Duration> durations = durationRepository.findAll();
        List<DurationDto> durationList = new ArrayList<>();

        durations.forEach(duration -> {
            DurationDto durationDto = new DurationDto();
            durationDto.setId(duration.getId());
            durationDto.setDuration(duration.getDuration());
            durationDto.setDurationType(duration.getDurationType());

            durationList.add(durationDto);
        });

        if (durations == null) {
            return requestHelper.setError(HttpStatus.NOT_FOUND, "No students found");
        } else {
            return requestHelper.setResponse(durationList);
        }
    }

    @Override
    public TransportDto createDuration(Duration duration) {
        durationRepository.save(duration);
        TransportDto durationDto = requestHelper.setResponse(duration);
        return durationDto;
    }

    @Override
    public TransportDto editDuration(UUID id, Duration duration) {
        return null;
    }

    @Override
    public boolean deleteDuration(UUID id) {
        try {
            durationRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
