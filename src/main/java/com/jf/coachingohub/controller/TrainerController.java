package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.setdto.ClientCreateDto;
import com.jf.coachingohub.dto.getdto.ClientDto;
import com.jf.coachingohub.dto.getdto.TrainerDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.service.ClientService;
import com.jf.coachingohub.service.TrainerService;
import com.jf.coachingohub.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    private final TrainerService trainerService;
    private final ClientService clientService;
    private final UserService userService;

    public TrainerController(TrainerService trainerService, ClientService clientService, UserService userService) {
        this.trainerService = trainerService;
        this.clientService = clientService;
        this.userService = userService;
    }

    //utworzyc frontend tylko jesli przydatny
    @GetMapping("/{id}")
    public ResponseEntity<TrainerDto> getTrainerById(@PathVariable Long id) {
        return trainerService.findDtoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //utworzyc frontend tylko jesli przydatny
    @GetMapping("/username/{username}")
    public ResponseEntity<TrainerDto> getTrainerByUsername(@PathVariable String username) {
        return trainerService.findDtoByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/clients")
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientCreateDto clientCreateDto) {
        // Pobieranie zalogowanego użytkownika z SecurityContext
        org.springframework.security.core.userdetails.User authenticatedUser =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = authenticatedUser.getUsername(); // Pobierz login zalogowanego użytkownika
        Optional<Trainer> trainerOptional = trainerService.findByUsername(username);
        Trainer trainer = trainerOptional.orElseThrow(() -> new RuntimeException("Trainer not found"));

        Client createdClient = clientService.createClient(clientCreateDto, trainer.getId());
        return ResponseEntity.ok(createdClient);
    }


    // Endpoint do pobierania listy klientów powiązanych z zalogowanym trenerem
    @GetMapping("/clients")
    public ResponseEntity<List<ClientDto>> getClients() {
        // Pobieranie zalogowanego użytkownika z SecurityContext
        org.springframework.security.core.userdetails.User authenticatedUser =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        // Pobranie nazwy użytkownika zalogowanego trenera
        String username = authenticatedUser.getUsername();
        // Wyszukanie obiektu trenera na podstawie loginu użytkownika
        Optional<Trainer> trainerOptional = trainerService.findByUsername(username);
        // Jeśli trener nie zostanie znaleziony, zgłoszenie wyjątku
        Trainer trainer = trainerOptional.orElseThrow(() -> new RuntimeException("Trainer not found"));
        // Pobranie listy klientów powiązanych z identyfikatorem trenera
        List<ClientDto> clients = clientService.findDtoByTrainerId(trainer.getId());
        // Zwrócenie listy klientów w odpowiedzi HTTP
        return ResponseEntity.ok(clients);
    }


    @GetMapping("/clients/{id}")
    public ResponseEntity<ClientDto> getClientById(@PathVariable Long id) {
        // Znajdź klienta po jego ID
        ClientDto clientDto = clientService.findDtoById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        return ResponseEntity.ok(clientDto);
    }

    @DeleteMapping("/clients/{clientId}")
    public ResponseEntity<String> deleteClient(@PathVariable Long clientId) {
        // Pobieranie zalogowanego użytkownika z SecurityContext
        org.springframework.security.core.userdetails.User authenticatedUser =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = authenticatedUser.getUsername();
        Optional<Trainer> trainerOptional = trainerService.findByUsername(username);
        Trainer trainer = trainerOptional.orElseThrow(() -> new RuntimeException("Trainer not found"));

        // Usunięcie klienta
        userService.deleteClient(clientId, trainer.getId());
        return ResponseEntity.ok("Client deleted successfully.");
    }


}
