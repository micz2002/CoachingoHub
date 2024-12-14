package com.jf.coachingohub.repository;

import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByTrainerId(Long trainerId);
}

