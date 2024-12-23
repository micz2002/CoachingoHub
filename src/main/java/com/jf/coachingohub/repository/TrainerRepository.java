package com.jf.coachingohub.repository;

import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Optional<Trainer> findByUser_Username(String username);
}
