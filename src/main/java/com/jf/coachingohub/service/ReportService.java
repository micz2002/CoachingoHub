package com.jf.coachingohub.service;

import com.jf.coachingohub.dto.getdto.ReportDto;
import com.jf.coachingohub.model.Client;
import com.jf.coachingohub.model.Report;
import com.jf.coachingohub.model.Trainer;
import com.jf.coachingohub.repository.ReportRepository;
import com.twilio.twiml.voice.Pay;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.xwpf.usermodel.*;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ClientService clientService;

    public ReportService(ReportRepository reportRepository, ClientService clientService) {
        this.reportRepository = reportRepository;
        this.clientService = clientService;
    }


    @Transactional
    public Report createReport(Report report) {
        // Pobranie zalogowanego użytkownika
        String username = ((org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        Client client = clientService.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        Trainer trainer = client.getTrainer();

        // Utworzenie raportu z automatycznym przypisaniem klienta i trenera
        Report newReport = new Report();
        newReport.setTitle(report.getTitle());
        newReport.setDateFilled(report.getDateFilled());
        newReport.setWeightMeasurement(report.getWeightMeasurement());
        newReport.setWaistMeasurement(report.getWaistMeasurement());
        newReport.setChestMeasurement(report.getChestMeasurement());
        newReport.setLeftBicepMeasurement(report.getLeftBicepMeasurement());
        newReport.setRightBicepMeasurement(report.getRightBicepMeasurement());
        newReport.setLeftForearmMeasurement(report.getLeftForearmMeasurement());
        newReport.setRightForearmMeasurement(report.getRightForearmMeasurement());
        newReport.setLeftThighMeasurement(report.getLeftThighMeasurement());
        newReport.setRightThighMeasurement(report.getRightThighMeasurement());
        newReport.setLeftCalfMeasurement(report.getLeftCalfMeasurement());
        newReport.setRightCalfMeasurement(report.getRightCalfMeasurement());
        newReport.setWeeklyWorkouts(report.getWeeklyWorkouts());
        newReport.setWeeklyCardio(report.getWeeklyCardio());
        newReport.setTrainingProgress(report.getTrainingProgress());
        newReport.setSleepQuality(report.getSleepQuality());
        newReport.setDietAdherence(report.getDietAdherence());
        newReport.setAdditionalNotes(report.getAdditionalNotes());
        newReport.setClient(client);
        newReport.setTrainer(trainer);

        return reportRepository.save(newReport);
    }


    public List<ReportDto> getReportsByClient(Long clientId) {
        return reportRepository.findByClientId(clientId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ReportDto convertToDto(Report report) {
        ReportDto reportDto = new ReportDto();
        reportDto.setId(report.getId());
        reportDto.setClientFirstName(report.getClient().getUser().getFirstName());
        reportDto.setClientLastName(report.getClient().getUser().getLastName());
        reportDto.setTitle(report.getTitle());
        reportDto.setDateFilled(report.getDateFilled());
        reportDto.setWeightMeasurement(report.getWeightMeasurement());
        reportDto.setWaistMeasurement(report.getWaistMeasurement());
        reportDto.setChestMeasurement(report.getChestMeasurement());
        reportDto.setLeftBicepMeasurement(report.getLeftBicepMeasurement());
        reportDto.setRightBicepMeasurement(report.getRightBicepMeasurement());
        reportDto.setLeftForearmMeasurement(report.getLeftForearmMeasurement());
        reportDto.setRightForearmMeasurement(report.getRightForearmMeasurement());
        reportDto.setLeftThighMeasurement(report.getLeftThighMeasurement());
        reportDto.setRightThighMeasurement(report.getRightThighMeasurement());
        reportDto.setLeftCalfMeasurement(report.getLeftCalfMeasurement());
        reportDto.setRightCalfMeasurement(report.getRightCalfMeasurement());
        reportDto.setWeeklyWorkouts(report.getWeeklyWorkouts());
        reportDto.setWeeklyCardio(report.getWeeklyCardio());
        reportDto.setTrainingProgress(report.getTrainingProgress());
        reportDto.setSleepQuality(report.getSleepQuality());
        reportDto.setDietAdherence(report.getDietAdherence());
        reportDto.setAdditionalNotes(report.getAdditionalNotes());
        return reportDto;
    }

    
    public List<ReportDto> getReportsByTrainer(Long trainerId) {
        return reportRepository.findByTrainerId(trainerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

    }

    public Report getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
    }

    public void deleteReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
        reportRepository.delete(report);
    }


    @Transactional
    public byte[] generateReportDocx(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        try (XWPFDocument document = new XWPFDocument()) {
            // Tytuł
            XWPFParagraph title = document.createParagraph();
            title.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = title.createRun();
            titleRun.setBold(true);
            titleRun.setFontSize(18);
            titleRun.setText("Raport: " + report.getTitle());

            // Dane szczegółowe
            XWPFParagraph details = document.createParagraph();
            details.setAlignment(ParagraphAlignment.LEFT);
            XWPFRun detailsRun = details.createRun();
            detailsRun.setFontSize(12);
            detailsRun.setText("Data wypełnienia: " + report.getDateFilled());
            detailsRun.addBreak();
            detailsRun.setText("Pomiar wagi: " + report.getWeightMeasurement() + " kg");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar talii: " + report.getWaistMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar klatki: " + report.getChestMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar bicepsu (lewy): " + report.getLeftBicepMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar bicepsu (prawy): " + report.getRightBicepMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar przedramienia (lewe): " + report.getLeftForearmMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar przedramienia (prawe): " + report.getRightForearmMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar uda (lewe): " + report.getLeftThighMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar uda (prawe): " + report.getRightThighMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar łydki (lewa): " + report.getLeftCalfMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Pomiar łydki (prawa): " + report.getRightCalfMeasurement() + " cm");
            detailsRun.addBreak();
            detailsRun.setText("Ilość zrealizowanych treningów w tygodniu: " + report.getWeeklyWorkouts());
            detailsRun.addBreak();
            detailsRun.setText("Ilość lub forma zrealizowanego cardio: " + report.getWeeklyWorkouts());
            detailsRun.addBreak();
            detailsRun.setText("Progres treningowy: " + report.getTrainingProgress());
            detailsRun.addBreak();
            detailsRun.setText("Sen: " + report.getSleepQuality());
            detailsRun.addBreak();
            detailsRun.setText("Dieta " + report.getDietAdherence());
            detailsRun.addBreak();
            detailsRun.setText("Inne uwagi: " + report.getAdditionalNotes());

            // Eksportowanie dokumentu do byte[]
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error generating DOCX file", e);
        }
    }
}

