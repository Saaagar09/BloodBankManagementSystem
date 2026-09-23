package com.example.bloodbankmanagementsystem.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class DonorDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be >= 18")
    private Integer age;

    @NotBlank(message = "City is required")
    @Size(min = 2, message = "City name too short")
    private String city;

    @Pattern(
            regexp = "^(A|B|AB|O)[+-]$",
            message = "Invalid blood group (Example: A+, O-, AB+)"
    )
    private String bloodGroup;

    @NotNull(message = "Enter your number ")
    private Long contactNumber;
}