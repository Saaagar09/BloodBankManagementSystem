package com.example.bloodbankmanagementsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class DonorAdminDTO {

    private Long id;
    private String name;
    private Integer age;
    private String city;
    private String bloodGroup;
    private Long contactNumber;
}