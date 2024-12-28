package com.jf.coachingohub.dto.getdto;

import java.time.LocalDateTime;

public class AppointmentDto {

    private Long id;
    private Long clientId;
    private Long trainerId;
    private LocalDateTime date;
    private String status;

    public AppointmentDto(Long id, Long clientId, Long trainerId, LocalDateTime date, String status) {
        this.id = id;
        this.clientId = clientId;
        this.trainerId = trainerId;
        this.date = date;
        this.status = status;
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
}

