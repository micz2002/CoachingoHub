package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.AppointmentDto;
import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByClient(@PathVariable Long clientId) {
        List<AppointmentDto> appointments = appointmentService.findByClientId(clientId);
        if (appointments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByTrainer(@PathVariable Long trainerId) {
        List<AppointmentDto> appointments = appointmentService.findByTrainerId(trainerId);
        if (appointments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Optional<Appointment> createdAppointment = Optional.ofNullable(appointmentService.save(appointment));
        return createdAppointment
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
}

