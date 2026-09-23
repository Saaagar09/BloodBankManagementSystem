package com.example.bloodbankmanagementsystem.exception;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
    public class ValidationErrorResponse {

        private Map<String, String> errors;
        private LocalDateTime timestamp;

        public ValidationErrorResponse(Map<String, String> errors) {
            this.errors = errors;
            this.timestamp = LocalDateTime.now();
        }

    }
