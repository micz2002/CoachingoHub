package com.jf.coachingohub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Wyłączenie CSRF (opcjonalne, zależy od potrzeb)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Zezwól na dostęp do wszystkich endpointów
                )
                .formLogin(form -> form.disable()) // Wyłącz domyślną stronę logowania
                .httpBasic(basic -> basic.disable()); // Wyłącz BasicAuth (opcjonalnie)

        return http.build();
    }
}

