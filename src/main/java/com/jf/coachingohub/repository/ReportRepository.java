package com.jf.coachingohub.repository;

import com.jf.coachingohub.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByTrainerId(Long trainerId);
    List<Report> findByClientId(Long clientId);
}
