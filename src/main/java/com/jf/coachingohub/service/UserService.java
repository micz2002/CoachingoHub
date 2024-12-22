package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.UserDto;
import com.jf.coachingohub.dto.UserAndTrainerRegisterDto;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.TrainerRepository;
import com.jf.coachingohub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, TrainerRepository trainerRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
    }
    private UserDto convertToDto(User user) {
        return new UserDto(user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name());
    }

    public Optional<UserDto> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToDto);
    }

    public Optional<UserDto> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDto);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User registerTrainer(UserAndTrainerRegisterDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setRole(User.Role.TRAINER);

        User savedUser = userRepository.save(user);

        Trainer trainer = new Trainer();
        trainer.setUser(savedUser);
        trainer.setSpecialization(dto.getSpecialization());
        trainer.setExperience(dto.getExperience());

        trainerRepository.save(trainer);

        return savedUser;
    }
}
//TODO user i trainer
