package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.WorkoutDto;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<WorkoutDto>> getWorkoutsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(workoutService.findByClientId(clientId));
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<WorkoutDto>> getWorkoutsByTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(workoutService.findByTrainerId(trainerId));
    }

    @PostMapping
    public ResponseEntity<Workout> createWorkout(@RequestBody Workout workout) {
        return ResponseEntity.ok(workoutService.save(workout));
    }
}

