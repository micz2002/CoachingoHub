package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.getdto.ClientDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }


    @GetMapping("/trainers/{trainerId}")
    public ResponseEntity<List<ClientDto>> getClientsByTrainer(@PathVariable Long trainerId) {
        List<ClientDto> clients = clientService.findDtoByTrainerId(trainerId);
        if (clients.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(clients);
    }

}

