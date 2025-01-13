package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.getdto.TrainerDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.repository.ClientRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TrainerService {

    private final TrainerRepository trainerRepository;
    private final ClientRepository clientRepository;

    public TrainerService(TrainerRepository trainerRepository, ClientRepository clientRepository) {
        this.trainerRepository = trainerRepository;
        this.clientRepository = clientRepository;
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
                trainer.getUser().getLastName(),
                trainer.getUser().getEmail(),
                trainer.getUser().getPhoneNumber());
    }
    public Optional<TrainerDto> findDtoById(Long id) {
        return trainerRepository.findById(id)
                .map(this::convertToDto);
    }

    public Optional<Trainer> findById(Long id) {
        return trainerRepository.findById(id);
    }

    public Optional<Trainer> findByUsername(String username) {
        return Optional.ofNullable(trainerRepository.findByUser_Username(username)
                .orElseThrow(() -> new RuntimeException("Trainer not found")));
    }

    public Optional<TrainerDto> findDtoByUsername(String username) {
        return trainerRepository.findByUser_Username(username)
                .map(this::convertToDto);
    }

    public Optional<TrainerDto> findDtoByClientUsername(String username) {
        return trainerRepository.findByUser_Username(username)
                .map(this::convertToDto);
    }

    public TrainerDto findTrainerDtoByClientUsername(String username) {
        Client client = clientRepository.findByUser_Username(username)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Trainer trainer = client.getTrainer();
        if (trainer == null) {
            throw new RuntimeException("No trainer assigned to this client");
        }

        return convertToDto(trainer);
    }
}
