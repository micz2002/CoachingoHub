package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.ClientCreateDto;
import com.jf.coachingohub.dto.TrainerDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.service.ClientService;
import com.jf.coachingohub.service.TrainerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    private final TrainerService trainerService;
    private final ClientService clientService;

    public TrainerController(TrainerService trainerService, ClientService clientService) {
        this.trainerService = trainerService;
        this.clientService = clientService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerDto> getTrainerById(@PathVariable Long id) {
        return trainerService.findDtoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<TrainerDto> getTrainerByUsername(@PathVariable String username) {
        return trainerService.findDtoByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Trainer> createTrainer(@RequestBody Trainer trainer) {
        Optional<Trainer> createdTrainer = Optional.ofNullable(trainerService.save(trainer));
        return createdTrainer
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/clients")
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientCreateDto clientCreateDto) {
        // Pobierz zalogowanego użytkownika z SecurityContext
        org.springframework.security.core.userdetails.User authenticatedUser =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = authenticatedUser.getUsername(); // Pobierz login zalogowanego użytkownika
        Optional<Trainer> trainerOptional = trainerService.findByUsername(username);
        Trainer trainer = trainerOptional.orElseThrow(() -> new RuntimeException("Trainer not found"));

        Client createdClient = clientService.createClient(clientCreateDto, trainer.getId());
        return ResponseEntity.ok(createdClient);
    }



}
