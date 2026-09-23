package com.example.bloodbankmanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class RecipientEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer age;
    private String city;
    private Integer units;
    private String purpose;
    private String bloodGroup;
    private Long contactNumber;
    private Boolean isDeleted;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private MyUser user;
}
