package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.UserDto;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private UserDto convertToDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName());
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
}
//TODO user i trainer
