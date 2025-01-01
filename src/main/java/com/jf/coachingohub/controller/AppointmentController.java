package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.setdto.AppointmentCreateDto;
import com.jf.coachingohub.dto.getdto.AppointmentDto;
import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.service.AppointmentService;
import com.jf.coachingohub.service.TrainerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final TrainerService trainerService;

    public AppointmentController(AppointmentService appointmentService, TrainerService trainerService) {
        this.appointmentService = appointmentService;
        this.trainerService = trainerService;
    }

    //utworzyc frontend tylko jesli przydatny
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByClient(@PathVariable Long clientId) {
        List<AppointmentDto> appointments = appointmentService.findByClientId(clientId);
        if (appointments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(appointments);
    }

    //utworzyc frontend tylko jesli przydatny
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByTrainer(@PathVariable Long trainerId) {
        List<AppointmentDto> appointments = appointmentService.findDtoByTrainerId(trainerId);
        if (appointments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(appointments);
    }
    //Na pewno stworzyc frontend do tego, jest to umówienie wizyty dla danego klienta przez zalogowanego trenera tworzac wizyte
    //zalozenei jest zebym nacisnal np przycisk umow wizyte przy danym kliencie i autoamtucznie zostanie przekazane juz username klienta trenera
    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody @Valid AppointmentCreateDto appointmentCreateDto) {
        // Pobieranie zalogowanego użytkownika z SecurityContext
        org.springframework.security.core.userdetails.User authenticatedUser =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = authenticatedUser.getUsername();
        Optional<Trainer> trainerOptional = trainerService.findByUsername(username);
        Trainer trainer = trainerOptional.orElseThrow(() -> new RuntimeException("Trainer not found"));

        // Utworzenie wizyty
        Appointment appointment = appointmentService.createAppointment(appointmentCreateDto, trainer.getId());
        return ResponseEntity.ok(appointment);
    }
}

