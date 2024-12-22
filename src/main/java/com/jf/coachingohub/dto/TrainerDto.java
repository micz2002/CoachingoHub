package com.jf.coachingohub.dto;

public class TrainerDto {

    private Long id;
    private String specialization;
    private Integer experience;
    private String firstName;
    private String lastName;

    public TrainerDto(Long id, String specialization, Integer experience, String firstName, String lastName) {
        this.id = id;
        this.specialization = specialization;
        this.experience = experience;
        this.firstName = firstName;
        this.lastName = lastName;
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
