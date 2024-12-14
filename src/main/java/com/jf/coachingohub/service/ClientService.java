package com.jf.coachingohub.service;

import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.repository.ClientRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public List<Client> findByTrainerId(Long trainerId) {
        return clientRepository.findByTrainerId(trainerId);
    }
}

