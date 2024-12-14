package com.jf.coachingohub.controller;

import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(appointmentService.findByClientId(clientId));
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(appointmentService.findByTrainerId(trainerId));
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.save(appointment));
    }
}

