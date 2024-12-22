package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.TrainerDto;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.repository.TrainerRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TrainerService {

    private final TrainerRepository trainerRepository;

    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    public Trainer save(Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    private TrainerDto convertToDto(Trainer trainer) {
        return new TrainerDto(
                trainer.getId(),
                trainer.getSpecialization(),
                trainer.getExperience(),
                trainer.getUser().getFirstName(),
                trainer.getUser().getLastName());
    }
    public Optional<TrainerDto> findTrainerById(Long id) {
        return trainerRepository.findById(id)
                .map(this::convertToDto);
    }
}
