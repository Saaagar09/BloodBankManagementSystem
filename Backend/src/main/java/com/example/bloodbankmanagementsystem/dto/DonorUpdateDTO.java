package com.example.bloodbankmanagementsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class DonorUpdateDTO {
    private String name;
    private Integer age;
    private String bloodGroup;
    private String city;
    private Long contactNumber;

}
