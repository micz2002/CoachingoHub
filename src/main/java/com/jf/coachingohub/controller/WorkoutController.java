package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.WorkoutCreateDto;
import com.jf.coachingohub.dto.WorkoutDto;
import com.jf.coachingohub.dto.WorkoutUpdateDto;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.service.TrainerService;
import com.jf.coachingohub.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final TrainerService trainerService;

    public WorkoutController(WorkoutService workoutService, TrainerService trainerService) {
        this.workoutService = workoutService;
        this.trainerService = trainerService;
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<WorkoutDto>> getWorkoutsByClient(@PathVariable Long clientId) {
        List<WorkoutDto> workouts = workoutService.findDtoByClientId(clientId);
        if (workouts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(workouts);
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<WorkoutDto>> getWorkoutsByTrainer(@PathVariable Long trainerId) {
        List<WorkoutDto> workouts = workoutService.findDtoByTrainerId(trainerId);
        if (workouts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(workouts);
    }


    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping
    public ResponseEntity<Workout> createWorkout(@RequestBody @Valid WorkoutCreateDto workoutCreateDto) {
        // Pobieranie zalogowanego użytkownika z SecurityContext
        org.springframework.security.core.userdetails.User authenticatedUser =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = authenticatedUser.getUsername();
        Optional<Trainer> trainerOptional = trainerService.findByUsername(username);
        Trainer trainer = trainerOptional.orElseThrow(() -> new RuntimeException("Trainer not found"));

        // Utwórz trening
        Workout workout = workoutService.createWorkout(workoutCreateDto, trainer.getId());
        return ResponseEntity.ok(workout);
    }


    @PreAuthorize("hasRole('TRAINER')")
    @PatchMapping("/{workoutId}")
    public ResponseEntity<Workout> updateWorkout(
            @PathVariable Long workoutId,
            @RequestBody Map<String, Object> updates) {

        Workout updatedWorkout = workoutService.partialUpdateWorkout(workoutId, updates);
        return ResponseEntity.ok(updatedWorkout);
    }

}

