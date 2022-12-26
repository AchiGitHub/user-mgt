package com.lifestyleservice.lifestyle.controller;

import com.lifestyleservice.lifestyle.dto.RegisterUserDto;
import com.lifestyleservice.lifestyle.dto.RegistrationDto;
import com.lifestyleservice.lifestyle.entity.Registration;
import com.lifestyleservice.lifestyle.service.RegistrationService;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/v1/registration")
@Slf4j
public class RegistrationController {
    private RegistrationService registrationService;
    private ModelMapper modelMapper;

    public RegistrationController(RegistrationService registrationService, ModelMapper modelMapper) {
        this.registrationService = registrationService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("")
    public ResponseEntity<Object> createRegistration(@RequestBody RegistrationDto registrationDto) {
        Registration res = modelMapper.map(registrationDto, Registration.class);
        LocalDateTime now = LocalDateTime.now();
        res.setCreatedDate(now);
        res.setCreatedDate(now);
        res.setCreatedBy("ADMIN");
        res.setLastModifiedBy("ADMIN");
        TransportDto createdRegistration = registrationService.createRegistration(res);
        log.info("Registration {}", createdRegistration);

        return ResponseEntity.ok(createdRegistration.getResponse());
    }

    @GetMapping("")
    public ResponseEntity getAllRegistrations() {
        TransportDto res = registrationService.getAllRegistrations();
        if (res.getError() != null) {
            return ResponseEntity.status(res.getError().getStatus()).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity getRegistration(@PathVariable UUID id) {
        TransportDto res = registrationService.getRegistration(id);
        if (res.getError() != null) {
            return ResponseEntity.status(res.getError().getStatus()).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity updateRegistration(@PathVariable UUID id, @RequestBody RegistrationDto registrationDto) {
        Registration registration = modelMapper.map(registrationDto, Registration.class);
        TransportDto res = registrationService.updateRegistration(id, registration);

        if (res.getError() != null) {
            return ResponseEntity.status(res.getError().getStatus()).body(res);
        } else {
            return ResponseEntity.ok(res);
        }
    }

    @PostMapping("/new")
    public ResponseEntity createUserRegistration(@RequestBody RegisterUserDto registerUserDto) {
        TransportDto res = registrationService.createNewRegistration(registerUserDto);
        if (res.getError() != null) {
            return ResponseEntity.status(res.getError().getStatus()).body(res);
        } else {
            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(res.getResponse())
                    .toUri();
            return ResponseEntity.created(location).build();
        }
    }
}
