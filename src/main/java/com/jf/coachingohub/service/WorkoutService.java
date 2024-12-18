package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.WorkoutDto;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.repository.TrainerRepository;
import com.jf.coachingohub.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    public WorkoutService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    public Workout save(Workout workout) {
        return workoutRepository.save(workout);
    }

    private WorkoutDto convertToDto(Workout workout) {
        return new WorkoutDto(
                workout.getId(),
                workout.getClient().getId(),
                workout.getTrainer().getId(),
                workout.getDescription(),
                workout.getDate()
        );
    }

    public List<WorkoutDto> findByClientId(Long clientId) {
        return workoutRepository.findByClientId(clientId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<WorkoutDto> findByTrainerId(Long trainerId) {
        return workoutRepository.findByTrainerId(trainerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}
