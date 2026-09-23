package com.example.bloodbankmanagementsystem.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterDTO {

        private String username;
        private String password;
        private String email;

    }
