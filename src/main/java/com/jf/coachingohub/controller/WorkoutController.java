package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.WorkoutDto;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
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

    @PostMapping
    public ResponseEntity<Workout> createWorkout(@RequestBody Workout workout) {
        Optional<Workout> createdWorkout = Optional.ofNullable(workoutService.save(workout));
        return createdWorkout
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
}

