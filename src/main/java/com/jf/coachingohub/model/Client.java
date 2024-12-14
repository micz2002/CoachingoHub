package com.jf.coachingohub.model;

import jakarta.persistence.*;


@Entity
@Table(name = "clients")
public class Client {

    @Id
    private Long id;

    @Column
    private Integer age;

    @Column
    private Float weight;

    @Column
    private Float height;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    // Getters and setters
}
