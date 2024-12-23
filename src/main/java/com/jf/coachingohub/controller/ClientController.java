package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.ClientDto;
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

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<ClientDto>> getClientsByTrainer(@PathVariable Long trainerId) {
        List<ClientDto> clients = clientService.findDtoByTrainerId(trainerId);
        if (clients.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(clients);
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        Optional<Client> createdClient = Optional.ofNullable(clientService.save(client));
        return createdClient
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
}

