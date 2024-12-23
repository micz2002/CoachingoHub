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
    public Optional<TrainerDto> findDtoById(Long id) {
        return trainerRepository.findById(id)
                .map(this::convertToDto);
    }

    public Optional<Trainer> findByUsername(String username) {
        return Optional.ofNullable(trainerRepository.findByUser_Username(username)
                .orElseThrow(() -> new RuntimeException("Trainer not found")));
    }

    public Optional<TrainerDto> findDtoByUsername(String username) {
        return trainerRepository.findByUser_Username(username)
                .map(this::convertToDto);
    }
}
