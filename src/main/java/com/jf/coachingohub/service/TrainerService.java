package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.TrainerDto;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.TrainerRepository;
import com.jf.coachingohub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class TrainerService {

    private final TrainerRepository trainerRepository;

    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    public Trainer save(Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    public Optional<TrainerDto> findTrainerById(Long id) {
        return trainerRepository.findById(id)
                .map(trainer -> new TrainerDto(trainer.getId(), trainer.getSpecialization(), trainer.getExperience()));
    }
}
