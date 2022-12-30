package com.lifestyleservice.lifestyle.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lifestyleservice.lifestyle.enums.Gender;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Members")
public class Member extends Auditable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
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
    private Double weight;
    private Double height;
    @NotNull
    private Gender gender;
}
