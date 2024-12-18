package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.ClientDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<ClientDto>> getClientsByTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(clientService.findByTrainerId(trainerId));
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return ResponseEntity.ok(clientService.save(client));
    }
}

