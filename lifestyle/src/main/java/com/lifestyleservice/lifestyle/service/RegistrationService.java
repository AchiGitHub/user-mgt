package com.lifestyleservice.lifestyle.service;

import com.lifestyleservice.lifestyle.dto.RegisterUserDto;
import com.lifestyleservice.lifestyle.dto.RegistrationDto;
import com.lifestyleservice.lifestyle.entity.Registration;
import com.lifestyleservice.lifestyle.util.TransportDto;

import java.util.UUID;

public interface RegistrationService {
    TransportDto createRegistration(Registration register);
    TransportDto getAllRegistrations();
    TransportDto getRegistration(UUID id);
    boolean deleteRegistration(UUID id);
    TransportDto updateRegistration(UUID id, Registration register);
    TransportDto createNewRegistration(RegisterUserDto registrationDto);
}
