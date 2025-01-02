package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.setdto.ClientCreateDto;
import com.jf.coachingohub.dto.getdto.ClientDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.ClientRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import com.jf.coachingohub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ClientService(ClientRepository clientRepository, TrainerRepository trainerRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.trainerRepository = trainerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public ClientDto convertToDto(Client client) {
        return new ClientDto(
                client.getId(),
                client.getTrainer().getId(),
                client.getUser().getUsername(),
                client.getAge(),
                client.getWeight(),
                client.getHeight(),
                client.getUser().getFirstName(),
                client.getUser().getLastName(),
                client.getUser().getEmail(),
                client.getUser().getPhoneNumber());
    }

    public List<ClientDto> findDtoByTrainerId(Long trainerId) {
        return clientRepository.findByTrainerId(trainerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Client createClient(ClientCreateDto clientCreateDto, Long trainerId) {
        // Szukanie trenera w bazie
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));

        // Tworzenie użytkownika
        User user = new User();
        user.setUsername(clientCreateDto.getUsername());
        user.setPassword(passwordEncoder.encode(clientCreateDto.getPassword()));
        user.setFirstName(clientCreateDto.getFirstName());
        user.setLastName(clientCreateDto.getLastName());
        user.setEmail(clientCreateDto.getEmail());
        user.setPhoneNumber(clientCreateDto.getPhoneNumber());
        user.setRole(User.Role.CLIENT);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // Tworzenie klienta
        Client client = new Client();
        client.setUser(savedUser);
        client.setTrainer(trainer);
        client.setAge(clientCreateDto.getAge());
        client.setWeight(clientCreateDto.getWeight());
        client.setHeight(clientCreateDto.getHeight());

        return clientRepository.save(client);
    }
}

