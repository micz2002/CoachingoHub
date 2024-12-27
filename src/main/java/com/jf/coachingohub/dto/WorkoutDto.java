package com.jf.coachingohub.dto;

import java.time.LocalDateTime;

public class WorkoutDto {

    private Long id;
    private Long clientId;
    private Long trainerId;
    private String description;
    private LocalDateTime date;

    private String notes;

    public WorkoutDto(Long id, Long clientId, Long trainerId, String description, LocalDateTime date, String notes) {
        this.id = id;
        this.clientId = clientId;
        this.trainerId = trainerId;
        this.description = description;
        this.date = date;
        this.notes = notes;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

