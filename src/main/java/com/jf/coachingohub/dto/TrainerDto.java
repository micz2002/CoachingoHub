package com.jf.coachingohub.dto;

public class TrainerDto {

    private Long id;
    private String specialization;
    private Integer experience;

    public TrainerDto(Long id, String specialization, Integer experience) {
        this.id = id;
        this.specialization = specialization;
        this.experience = experience;
    }

    // Gettery i Settery
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }
}
