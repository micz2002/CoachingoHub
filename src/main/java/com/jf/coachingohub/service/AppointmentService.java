package com.jf.coachingohub.service;

import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.repository.AppointmentRepository;
import com.jf.coachingohub.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> findByClientId(Long clientId) {
        return appointmentRepository.findByClientId(clientId);
    }

    public List<Appointment> findByTrainerId(Long trainerId) {
        return appointmentRepository.findByTrainerId(trainerId);
    }
}

