package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.setdto.WorkoutCreateDto;
import com.jf.coachingohub.dto.getdto.WorkoutDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.repository.ClientRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import com.jf.coachingohub.repository.WorkoutRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ClientRepository clientRepository;
    private final TrainerRepository trainerRepository;

    public WorkoutService(WorkoutRepository workoutRepository, ClientRepository clientRepository, TrainerRepository trainerRepository) {
        this.workoutRepository = workoutRepository;
        this.clientRepository = clientRepository;
        this.trainerRepository = trainerRepository;
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
                workout.getDate(),
                workout.getNotes());
    }

    public List<WorkoutDto> findDtoByClientId(Long clientId) {
        return workoutRepository.findByClientId(clientId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<WorkoutDto> findDtoByTrainerId(Long trainerId) {
        return workoutRepository.findByTrainerId(trainerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Workout createWorkout(WorkoutCreateDto workoutCreateDto, Long trainerId) {
        // Szukanie klienta w bazie danych
        Client client = clientRepository.findByUser_Username(workoutCreateDto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        // Sprawdzenie, czy klient należy do zalogowanego trenera
        if (!client.getTrainer().getId().equals(trainerId)) {
            throw new IllegalArgumentException("Client does not belong to this trainer");
        }

        // Utworzenie nowego treningu
        Workout workout = new Workout();
        workout.setClient(client);
        workout.setTrainer(client.getTrainer());
        workout.setDescription(workoutCreateDto.getDescription());
        workout.setDate(workoutCreateDto.getDate());
        workout.setNotes(workoutCreateDto.getNotes());

        return workoutRepository.save(workout);
    }

//    @Transactional
//    public Workout updateWorkout(WorkoutUpdateDto workoutUpdateDto) {
//        Workout workout = workoutRepository.findById(workoutUpdateDto.getWorkoutId())
//                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
//
//        workout.setDescription(workoutUpdateDto.getDescription());
//        workout.setDate(workoutUpdateDto.getDate());
//        workout.setNotes(workoutUpdateDto.getNotes());
//
//        return workoutRepository.save(workout);
//    }

    @Transactional
    public Workout partialUpdateWorkout(Long workoutId, Map<String, Object> updates) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));

        // Aktualizacja tylko tych pól, które są w żądaniu
        if (updates.containsKey("description")) {
            workout.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("date")) {
            workout.setDate(LocalDateTime.parse((String) updates.get("date")));
        }
        if (updates.containsKey("notes")) {
            workout.setNotes((String) updates.get("notes"));
        }

        return workoutRepository.save(workout);
    }
}
