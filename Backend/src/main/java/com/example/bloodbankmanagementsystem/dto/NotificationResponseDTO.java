package com.example.bloodbankmanagementsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class NotificationResponseDTO {

    private Long id;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}