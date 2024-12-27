package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.AppointmentCreateDto;
import com.jf.coachingohub.dto.AppointmentDto;
import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.repository.AppointmentRepository;
import com.jf.coachingohub.repository.ClientRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ClientRepository clientRepository;
    private final TrainerRepository trainerRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, ClientRepository clientRepository, TrainerRepository trainerRepository) {
        this.appointmentRepository = appointmentRepository;
        this.clientRepository = clientRepository;
        this.trainerRepository = trainerRepository;
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

    public List<AppointmentDto> findDtoByTrainerId(Long trainerId) {
        return appointmentRepository.findByTrainerId(trainerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Appointment createAppointment(AppointmentCreateDto appointmentCreateDto, Long trainerId) {
        // Znajdowanie trenera
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));

        // Znajdowanie klienta na podstawie username
        Client client = clientRepository.findByUser_Username(appointmentCreateDto.getClientUsername())
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        // Sprawdzenie, czy klient należy do trenera
        if (!client.getTrainer().getId().equals(trainerId)) {
            throw new IllegalArgumentException("Client does not belong to this trainer");
        }

        // Utworzenie wizyty
        Appointment appointment = new Appointment();
        appointment.setClient(client);
        appointment.setTrainer(trainer);
        appointment.setDate(appointmentCreateDto.getDate());
        appointment.setStatus(Appointment.Status.PENDING);

        return appointmentRepository.save(appointment);
    }
}

