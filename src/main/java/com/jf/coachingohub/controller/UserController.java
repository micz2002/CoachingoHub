package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.getdto.ClientDto;
import com.jf.coachingohub.dto.getdto.TrainerDto;
import com.jf.coachingohub.dto.getdto.UserDto;
import com.jf.coachingohub.dto.setdto.UserAndTrainerRegisterDto;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.service.ClientService;
import com.jf.coachingohub.service.TrainerService;
import com.jf.coachingohub.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TrainerService trainerService;
    private final ClientService clientService;

    public UserController(UserService userService, TrainerService trainerService, ClientService clientService) {
        this.userService = userService;
        this.trainerService = trainerService;
        this.clientService = clientService;
    }

    //utworzyc frontend tylko jesli przydatny
    @GetMapping("/{username}")
    public ResponseEntity<Object> getUserByUsername(@PathVariable String username) {
        UserDto userDto = userService.findDtoByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDto.getRole().equals("TRAINER")) {
            Optional<TrainerDto> trainerDto = trainerService.findDtoByUsername(username);
            return ResponseEntity.ok(trainerDto);
        }

        if (userDto.getRole().equals("CLIENT")) {
            Optional<ClientDto> clientDto = clientService.findDtoByUsername(username);
            return ResponseEntity.ok(clientDto);
        }

        return ResponseEntity.ok(userDto);
    }

    //utworzyc frontend tylko jesli przydatny
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        return userService.findDtoByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Na pewno stworzyc frontend do tego, chce zeby to była rejestracja trenera, czyli głowna czynnosc jakas trzeba zrobic,
    //wiec trzeba przekaz na froncie wszystkie potrzebne rzeczy do tego bo dopiero po tym bedzie sie na koncie trenera i z niego mozna robic dalsze rzeczy
    @PostMapping("/register-trainer")
    public ResponseEntity<User> registerTrainer(@RequestBody @Valid UserAndTrainerRegisterDto dto) {
        Optional<User> registeredTrainer = Optional.ofNullable(userService.registerTrainer(dto));
        return registeredTrainer
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activateAccount(@RequestParam String token) {
        try {
            String response = userService.activateAccount(token);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //do sprawdzenia czy w kontekscie springa security jest obiekt zalogowanego uzytkownika
//    @GetMapping("/test-context")
//    public String testContext() {
//        return "Authentication in context: " + SecurityContextHolder.getContext().getAuthentication();
//    }

    //TODO DOROBIC FRONTA Z RESETEM HASLA
    @PostMapping("/forgot-password")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email, @RequestParam String resetUsername) {
        try {
            userService.generatePasswordResetToken(email, resetUsername);
            return ResponseEntity.ok("Password reset link sent to your email.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> verifyResetToken(@RequestParam String token) {
        try {
            userService.verifyResetToken(token);
            return ResponseEntity.ok("Your token: " + token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            userService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password reset successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping
    public ResponseEntity<String> updateAccount(@RequestBody Map<String, String> updates) {
        try {
            org.springframework.security.core.userdetails.User authenticatedUser =
                    (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            String username = authenticatedUser.getUsername();
            userService.updateAccount(username, updates);
            return ResponseEntity.ok("Account updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
