package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.NotificationDto;
import com.jf.coachingohub.model.Notification;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.repository.NotificationRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import org.springframework.stereotype.Service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }


    private NotificationDto convertToDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getUser().getId(),
                notification.getMessage(),
                notification.getSentAt()
        );
    }

    public List<NotificationDto> findByUserId(Long userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}
