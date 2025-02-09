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

    @PostMapping("/login") // Endpoint do obsługi logowania użytkownika
    public Map<String, String> login(@RequestBody Map<String, String> loginRequest) {
        // Pobranie nazwy użytkownika i hasła z żądania
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        try {
            // Próba uwierzytelnienia użytkownika za pomocą podanych danych
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            // Sprawdzenie, czy użytkownik jest aktywny i zweryfikowany (trener, bo klient jest aktywny, wynika to z implementacji)
            User user = userService.validateAndGetActiveUser(username);
            // Pobranie roli użytkownika w systemie
            String role = "ROLE_" + user.getRole().name();
            // Wygenerowanie tokenu JWT na podstawie nazwy użytkownika i jego roli
            String token = jwtUtil.generateToken(username, role);
            // Przygotowanie odpowiedzi, która zawiera wygenerowany token JWT
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return response; // Zwrócenie tokenu jako odpowiedź
        } catch (AuthenticationException e) {
            // Obsługa błędu uwierzytelnienia, np. w przypadku nieprawidłowego loginu lub hasła
            throw new RuntimeException("Invalid username or password");
        }
    }

}


