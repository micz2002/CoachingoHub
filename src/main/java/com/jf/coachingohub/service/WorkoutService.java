package com.jf.coachingohub.service;

import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.repository.TrainerRepository;
import com.jf.coachingohub.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    public WorkoutService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    public Workout save(Workout workout) {
        return workoutRepository.save(workout);
    }

    public List<Workout> findByClientId(Long clientId) {
        return workoutRepository.findByClientId(clientId);
    }

    public List<Workout> findByTrainerId(Long trainerId) {
        return workoutRepository.findByTrainerId(trainerId);
    }
}
