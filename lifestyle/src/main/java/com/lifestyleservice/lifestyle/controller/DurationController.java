package com.lifestyleservice.lifestyle.controller;

import com.lifestyleservice.lifestyle.dto.DurationDto;
import com.lifestyleservice.lifestyle.entity.Duration;
import com.lifestyleservice.lifestyle.service.DurationService;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/v1/membership/duration")
@Slf4j
public class DurationController {

    private DurationService durationService;
    private ModelMapper modelMapper;

    @Autowired
    public DurationController(DurationService durationService, ModelMapper modelMapper) {
        this.durationService = durationService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("")
    public ResponseEntity getDurations() {
        TransportDto res = durationService.getDurations();

        if (res.getError() != null) {
            return ResponseEntity.status(res.getError().getStatus()).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("")
    public ResponseEntity<Duration> createDuration(@RequestBody DurationDto durationDto) {
        Duration duration = modelMapper.map(durationDto, Duration.class);
        LocalDateTime now = LocalDateTime.now();
        duration.setCreatedDate(now);
        duration.setLastModifiedDate(now);
        duration.setLastModifiedBy("ADMIN");
        duration.setCreatedBy("ADMIN");

        TransportDto createdDuration = durationService.createDuration(duration);
        log.info("Duration {}", duration);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdDuration.getResponse())
                .toUri();
        return ResponseEntity.created(location).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteDuration(@PathVariable UUID id) {
        if (!durationService.deleteDuration(id)) {
            throw new IllegalStateException("Duration with id" + id);
        }
        return ResponseEntity.ok().build();
    }
}
