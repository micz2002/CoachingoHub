package com.jf.coachingohub.dto.getdto;

import java.time.LocalDateTime;

public class AppointmentDto {

    private Long id;
    private Long clientId;
    private Long trainerId;
    private LocalDateTime date;
    private String status;
    private String description;

    public AppointmentDto(Long id, Long clientId, Long trainerId, LocalDateTime date, String status, String description) {
        this.id = id;
        this.clientId = clientId;
        this.trainerId = trainerId;
        this.date = date;
        this.status = status;
        this.description = description;
    }

    // Gettery i Settery
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

