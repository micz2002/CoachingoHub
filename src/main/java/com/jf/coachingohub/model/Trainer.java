package com.jf.coachingohub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "trainers")
public class Trainer {

    @Id
    private Long id;

    @Column
    private String specialization;

    @Column
    private Integer experience;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    // Getters and setters
}
