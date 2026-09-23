package com.example.bloodbankmanagementsystem.controller;

import com.example.bloodbankmanagementsystem.dto.NotificationResponseDTO;
import com.example.bloodbankmanagementsystem.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<NotificationResponseDTO>> getMyNotifications() {

        List<NotificationResponseDTO> notifications =
                notificationService.getMyNotifications();

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {

        notificationService.markAsRead(id);

        return ResponseEntity.ok("Notification marked as read");
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<String> markAsAccepted(@PathVariable Long id) {

        notificationService.markAsAccepted(id);

        return ResponseEntity.ok("Blood request accepted");
    }

    @PatchMapping("/{id}/decline")
    public ResponseEntity<String> markAsDeclined(@PathVariable Long id) {

        notificationService.markAsDeclined(id);

        return ResponseEntity.ok("Blood request declined");
    }
}