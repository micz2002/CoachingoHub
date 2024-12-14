package com.jf.coachingohub.service;

import com.jf.coachingohub.model.Notification;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.repository.NotificationRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import org.springframework.stereotype.Service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> findByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
}
