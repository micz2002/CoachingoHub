package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.getdto.NotificationDto;
import com.jf.coachingohub.model.Notification;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SmsService smsService;

    public NotificationService(NotificationRepository notificationRepository, SmsService smsService) {
        this.notificationRepository = notificationRepository;
        this.smsService = smsService;
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

    public List<NotificationDto> findDtoByUserId(Long userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    @Transactional
    public void sendSms(User user, String message) {
        if (user.getPhoneNumber() == null || user.getPhoneNumber().isEmpty()) {
            throw new IllegalArgumentException("User has no phone number");
        }

        // Wysłanie SMS
        // TODO Wysłanie SMS za pomocą TWILIO lub zmienić na Vonage, ale teraz wersja komunikatu w konsoli
        // smsService.sendSms(user.getPhoneNumber(), message);
        System.out.println(user.getFirstName() + " " + user.getLastName() + " " + message);

        // Zapisanie powiadomienia w bazie danych
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setSentAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }
}
