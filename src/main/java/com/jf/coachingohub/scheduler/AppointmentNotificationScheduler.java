package com.jf.coachingohub.scheduler;

import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.model.User;
import com.jf.coachingohub.repository.AppointmentRepository;
import com.jf.coachingohub.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class AppointmentNotificationScheduler {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    public AppointmentNotificationScheduler(AppointmentRepository appointmentRepository, NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
    }

    //TODO pamietac odkomentowac ta funkcje
    @Scheduled(fixedRate = 60000) // Uruchamianie co minutę
    public void sendAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourLater = now.plusHours(1);

        // Pobranie wizyt zaplanowanych na następną godzinę
        List<Appointment> upcomingAppointments = appointmentRepository.findByDateBetweenAndNotifiedFalse(now, oneHourLater);

        for (Appointment appointment : upcomingAppointments) {
            User client = appointment.getClient().getUser();
            String message = "Przypomnienie: Masz trening zaplanowany na godzinę " + appointment.getDate();

            appointment.setNotified(true);
            appointmentRepository.save(appointment);

            notificationService.sendSms(client, message);

        }
    }
}
