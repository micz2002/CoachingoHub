package com.jf.coachingohub.repository;

import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByClientId(Long clientId);
    List<Workout> findByTrainerId(Long trainerId);

}

