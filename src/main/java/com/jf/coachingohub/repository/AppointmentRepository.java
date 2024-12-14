package com.jf.coachingohub.repository;

import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByClientId(Long clientId);
    List<Appointment> findByTrainerId(Long trainerId);
}

