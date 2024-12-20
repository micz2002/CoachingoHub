package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.UserDto;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.model.Workout;
import com.jf.coachingohub.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

    //TODO zrobic logowanie
}
