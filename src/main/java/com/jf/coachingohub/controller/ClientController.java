package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.getdto.ClientDto;
import com.jf.coachingohub.dto.getdto.TrainerDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.service.ClientService;
import com.jf.coachingohub.service.TrainerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;
    private final TrainerService trainerService;

    public ClientController(ClientService clientService, TrainerService trainerService) {
        this.clientService = clientService;
        this.trainerService = trainerService;
    }

    //utworzyc frontend tylko jesli przydatny
    @GetMapping("/trainers/{trainerId}")
    public ResponseEntity<List<ClientDto>> getClientsByTrainer(@PathVariable Long trainerId) {
        List<ClientDto> clients = clientService.findDtoByTrainerId(trainerId);
        if (clients.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/trainers")
    public ResponseEntity<TrainerDto> getTrainerByClient() {
        // Pobieranie zalogowanego użytkownika z SecurityContext
        org.springframework.security.core.userdetails.User authenticatedUser =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = authenticatedUser.getUsername();
        TrainerDto trainerDto = trainerService.findTrainerDtoByClientUsername(username);

        return ResponseEntity.ok(trainerDto);
    }




}

