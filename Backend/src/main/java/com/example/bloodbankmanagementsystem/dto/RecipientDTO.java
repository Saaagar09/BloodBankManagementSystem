package com.example.bloodbankmanagementsystem.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class RecipientDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be greater than or = 18")
    private Integer age;

    @NotBlank(message = "City is required")
    @Size(min = 2, message = "City name too short")
    private String city;

    @NotNull(message = "Units are required")
    @Min(value = 1, message = "Units must be at least 1")
    private Integer units;

    @NotBlank(message = "Purpose is required")
    @Size(min = 3, message = "Purpose too short")
    private String purpose;

    @NotBlank(message = "Blood group is required")
    @Pattern(
            regexp = "^(A|B|AB|O)[+-]$",
            message = "Invalid blood group (Example: A+, O-, AB+)"
    )
    private String bloodGroup;

    @NotNull(message = "Contact number is required")
    private Long contactNumber;
}