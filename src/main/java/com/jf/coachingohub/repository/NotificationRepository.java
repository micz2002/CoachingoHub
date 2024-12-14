package com.jf.coachingohub.repository;

import com.jf.coachingohub.model.Appointment;
import com.jf.coachingohub.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
}

