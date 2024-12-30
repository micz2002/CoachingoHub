package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.getdto.NotificationDto;
import com.jf.coachingohub.model.Notification;
import com.jf.coachingohub.repository.AppointmentRepository;
import com.jf.coachingohub.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
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

