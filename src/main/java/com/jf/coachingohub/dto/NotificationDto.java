package com.jf.coachingohub.dto;

import java.time.LocalDateTime;

public class NotificationDto {

    private Long id;
    private Long userId;
    private String message;
    private LocalDateTime sentAt;

    public NotificationDto(Long id, Long userId, String message, LocalDateTime sentAt) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.sentAt = sentAt;
    }

    // Gettery i Settery
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}

