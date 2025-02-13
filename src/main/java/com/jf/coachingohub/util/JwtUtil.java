package com.jf.coachingohub.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long EXPIRATION_TIME = 86400000; // 24 godziny

    // Pobierz nazwę użytkownika z tokena
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Pobierz rolę z tokena
    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    // Pobierz konkretny claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Wygeneruj token z rolą
    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); // Dodaj rolę do claims
        return createToken(claims, username);
    }

    // Walidacja tokena
    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    // Metoda do generowania tokenu JWT
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                // Ustawienie dodatkowych danych w tokenie representatively rolę użytkownika
                .setClaims(claims)
                // Ustawienie tematu tokena, reprezentującego nazwę użytkownika
                .setSubject(subject)
                // Ustawienie daty wygenerowania tokena
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // Ustawienie daty wygaśnięcia tokena (obliczonej na podstawie bieżącego czasu i stałej)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                // Podpisanie tokena algorytmem HS256 z użyciem klucza tajnego
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                // Utworzenie i zwrócenie tokena w formacie string
                .compact();
    }


    // Sprawdź, czy token wygasł
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Pobierz datę wygaśnięcia tokena
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Pobierz wszystkie claims
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }
}