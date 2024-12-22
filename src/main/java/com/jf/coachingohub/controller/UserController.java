package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.TrainerDto;
import com.jf.coachingohub.dto.UserDto;
import com.jf.coachingohub.dto.UserAndTrainerRegisterDto;
import com.jf.coachingohub.model.User;
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
        UserDto userDto = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

//        if (userDto.getRole().equals("TRAINER")) {
//            TrainerDto trainerDto = trainerService.find(username);
//            return ResponseEntity.ok(trainerDto);
//        }

        return ResponseEntity.ok(userDto);
    //DO ZROBIENIA SPRAWDZENIE CZY USER TO TRENER
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        Optional<User> createdUser = Optional.ofNullable(userService.save(user));
        return createdUser
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/register-trainer")
    public ResponseEntity<User> registerTrainer(@RequestBody @Valid UserAndTrainerRegisterDto dto) {
        Optional<User> registeredTrainer = Optional.ofNullable(userService.registerTrainer(dto));
        return registeredTrainer
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());

    }

    //TODO zrobic logowanie
}
