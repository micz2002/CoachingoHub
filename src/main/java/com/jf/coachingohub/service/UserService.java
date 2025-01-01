package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.getdto.UserDto;
import com.jf.coachingohub.dto.setdto.UserAndTrainerRegisterDto;
import com.jf.coachingohub.model.ActivationToken;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.ActivationTokenRepository;
import com.jf.coachingohub.repository.TrainerRepository;
import com.jf.coachingohub.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivationTokenRepository activationTokenRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, TrainerRepository trainerRepository, PasswordEncoder passwordEncoder, ActivationTokenRepository activationTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
        this.activationTokenRepository = activationTokenRepository;
        this.emailService = emailService;
    }

    private UserDto convertToDto(User user) {
        return new UserDto(user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name());
    }

    public Optional<UserDto> findDtoByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToDto);
    }

    public Optional<UserDto> findDtoByEmail(String email) {
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
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setRole(User.Role.TRAINER);
        user.setActive(false);

        User savedUser = userRepository.save(user);

        Trainer trainer = new Trainer();
        trainer.setUser(savedUser);
        trainer.setSpecialization(dto.getSpecialization());
        trainer.setExperience(dto.getExperience());

        trainerRepository.save(trainer);

        // Generowanie tokenu
        String token = UUID.randomUUID().toString();
        ActivationToken activationToken = new ActivationToken();
        activationToken.setToken(token);
        activationToken.setUser(savedUser);
        activationTokenRepository.save(activationToken);

        // Wysłanie e-maila aktywacyjnego
        String activationLink = "http://localhost:8080/api/users/activate?token=" + token;
        emailService.sendEmail("coachingo.hub.testing@gmail.com", "Activate your account",
                "<p>Hello, " + savedUser.getFirstName() + "!</p>" +
                        "<p>Click the link below to activate your account:</p>" +
                        "<a href='" + activationLink + "'>Activate Account</a>");

        return savedUser;
    }

    public String activateAccount(String token) {
        Optional<ActivationToken> optionalToken = activationTokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            throw new IllegalArgumentException("Invalid activation token");
        }

        ActivationToken activationToken = optionalToken.get();
        User user = activationToken.getUser();
        user.setActive(true); // Aktywacja konta
        userRepository.save(user);

        activationTokenRepository.delete(activationToken); // Usuń token po aktywacji

        return "Account activated successfully!";
    }

    public User validateAndGetActiveUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.isActive()) {
            throw new IllegalStateException("Account is not active. Please check your email for activation link.");
        }
        return user;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        //sprawdzenie czy uzytkownik zostal zweryfikowany i jest aktywny, w przypadku tej aplikacji glownie chodzi aktywacje kotna trenera
        if (!user.isActive()) {
            throw new RuntimeException("Account is not active.");
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .build();
    }

    @Transactional
    public void generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User with this email not found"));

        String token = UUID.randomUUID().toString();
        ActivationToken resetToken = new ActivationToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        activationTokenRepository.save(resetToken);

        String resetLink = "http://localhost:8080/api/users/reset-password?token=" + token;
        emailService.sendEmail("coachingo.hub.testing@gmail.com", "Reset your password",
                "<p>Hello, " + user.getFirstName() + "!</p>" +
                        "<p>Click the link below to reset your password:</p>" +
                        "<a href='" + resetLink + "'>Reset Password</a>");
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        ActivationToken resetToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        activationTokenRepository.delete(resetToken);
    }

}

