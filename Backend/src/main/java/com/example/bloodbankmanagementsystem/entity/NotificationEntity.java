package com.example.bloodbankmanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private String status;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private DonorEntity donor;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private RecipientEntity recipient;
}