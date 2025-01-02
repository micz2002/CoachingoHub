package com.jf.coachingohub.controller;

import com.jf.coachingohub.model.User;
import com.jf.coachingohub.service.UserService;
import com.jf.coachingohub.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    //Na pewno stworzyc frontend do tego, jest to logowanie przez które ma być przekazywany jesli sie powiedzie token z jwt
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Użycie serwisu do sprawdzenia czy uzytkownik jest zweryfikowany (trener bo klient zawsze jest aktywny bo tworzy go trener)
            User user = userService.validateAndGetActiveUser(username);

            // Pobierz rolę użytkownika
            String role = "ROLE_" + user.getRole().name();

            String token = jwtUtil.generateToken(username, role);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return response;
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }
}


