package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.AppointmentDto;
import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.repository.AppointmentRepository;
import com.jf.coachingohub.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    private AppointmentDto convertToDto(Appointment appointment) {
        return new AppointmentDto(
                appointment.getId(),
                appointment.getClient().getId(),
                appointment.getTrainer().getId(),
                appointment.getDate(),
                appointment.getStatus().name()
        );
    }

    public List<AppointmentDto> findByClientId(Long clientId) {
        return appointmentRepository.findByClientId(clientId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentDto> findByTrainerId(Long trainerId) {
        return appointmentRepository.findByTrainerId(trainerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}

