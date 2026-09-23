package com.example.bloodbankmanagementsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RecipientUpdateDTO {
    private String name;
    private Integer age;
    private String city;
    private Integer units;
    private String purpose;
    private String bloodGroup;
    private Long contactNumber;
}
