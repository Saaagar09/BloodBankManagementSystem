package com.example.bloodbankmanagementsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AcceptedDonorDTO {

    private Long id;
    private String name;
    private String bloodGroup;
    private String city;
    private Long contactNumber;
}