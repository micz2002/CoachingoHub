package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.ClientDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.repository.ClientRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public ClientDto convertToDto(Client client) {
        return new ClientDto(
                client.getId(),
                client.getTrainer().getId(),
                client.getAge(),
                client.getWeight(),
                client.getHeight()
        );
    }

    public List<ClientDto> findDtoByTrainerId(Long trainerId) {
        return clientRepository.findByTrainerId(trainerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}

