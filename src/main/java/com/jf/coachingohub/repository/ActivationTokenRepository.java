package com.jf.coachingohub.repository;

import com.jf.coachingohub.model.ActivationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivationTokenRepository extends JpaRepository <ActivationToken, Long> {
    Optional<ActivationToken> findByToken(String token);
}
