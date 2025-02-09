package com.jf.coachingohub.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Metoda odpowiedzialna za wysyłanie wiadomości e-mail
    public void sendEmail(String to, String subject, String content) {
        try {
            // Utworzenie obiektu wiadomości MIME
            MimeMessage message = mailSender.createMimeMessage();
            // Helper do ułatwienia ustawiania parametrów wiadomości
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            // Ustawienie adresu e-mail odbiorcy
            helper.setTo(to);
            // Ustawienie tematu wiadomości
            helper.setSubject(subject);
            // Ustawienie treści wiadomości, gdzie `true` oznacza możliwość przesyłania HTML
            helper.setText(content, true);
            // Wysłanie wiadomości za pomocą skonfigurowanego `JavaMailSender`
            mailSender.send(message);
        } catch (MessagingException e) {
            // Obsługa wyjątku w przypadku problemów z wysyłaniem e-maila
            throw new RuntimeException("Failed to send email", e);
        }
    }

}
