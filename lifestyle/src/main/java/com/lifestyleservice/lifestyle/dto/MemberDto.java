package com.lifestyleservice.lifestyle.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lifestyleservice.lifestyle.enums.Gender;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class MemberDto {
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime dob;
    private String nic;
    @NotNull
    private String address;
    @NotNull
    private String mobileNumber;
    private String secondaryNumber;
    private String occupation;
    @NotNull
    private Gender gender;
}
