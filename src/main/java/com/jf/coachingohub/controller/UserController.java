package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.getdto.TrainerDto;
import com.jf.coachingohub.dto.getdto.UserDto;
import com.jf.coachingohub.dto.setdto.UserAndTrainerRegisterDto;
import com.jf.coachingohub.model.ActivationToken;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.ActivationTokenRepository;
import com.jf.coachingohub.service.TrainerService;
import com.jf.coachingohub.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TrainerService trainerService;

    public UserController(UserService userService, TrainerService trainerService) {
        this.userService = userService;
        this.trainerService = trainerService;
    }


    @GetMapping("/{username}")
    public ResponseEntity<Object> getUserByUsername(@PathVariable String username) {
        UserDto userDto = userService.findDtoByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDto.getRole().equals("TRAINER")) {
            Optional<TrainerDto> trainerDto = trainerService.findDtoByUsername(username);
            return ResponseEntity.ok(trainerDto);
        }

        return ResponseEntity.ok(userDto);
    }


    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        return userService.findDtoByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


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

}
