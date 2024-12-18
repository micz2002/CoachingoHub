package com.jf.coachingohub.dto;

public class ClientDto {

    private Long id;
    private Long trainerId;
    private Integer age;
    private Float weight;
    private Float height;

    public ClientDto(Long id, Long trainerId, Integer age, Float weight, Float height) {
        this.id = id;
        this.trainerId = trainerId;
        this.age = age;
        this.weight = weight;
        this.height = height;
    }

    // Gettery i Settery
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Float getWeight() {
        return weight;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public Float getHeight() {
        return height;
    }

    public void setHeight(Float height) {
        this.height = height;
    }
}
