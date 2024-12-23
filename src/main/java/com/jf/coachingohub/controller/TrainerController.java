package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.TrainerDto;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.service.TrainerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
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
}
