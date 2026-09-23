package com.example.bloodbankmanagementsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RecipientResponseDTO {

    private Long id;
    private String name;
    private Integer age;
    private String city;
    private Integer units;
    private String purpose;
    private String bloodGroup;
    private Long contactNumber;

    private List<AcceptedDonorDTO> acceptedDonors;
}