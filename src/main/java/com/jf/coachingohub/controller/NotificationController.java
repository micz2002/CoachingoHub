package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.NotificationDto;
import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.model.Notification;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.AppointmentRepository;
import com.jf.coachingohub.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AppointmentRepository appointmentRepository;

    public NotificationController(NotificationService notificationService, AppointmentRepository appointmentRepository) {
        this.notificationService = notificationService;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByUser(@PathVariable Long userId) {
        List<NotificationDto> notifications = notificationService.findDtoByUserId(userId);
        if (notifications.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(notifications);
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Optional<Notification> createdNotification = Optional.ofNullable(notificationService.save(notification));
        return createdNotification
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

}

