package com.jf.coachingohub.controller;

import com.jf.coachingohub.dto.getdto.ReportDto;
import com.jf.coachingohub.model.Report;
import com.jf.coachingohub.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        Report createdReport = reportService.createReport(report);
        return ResponseEntity.ok(createdReport);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ReportDto>> getReportsByClient(@PathVariable Long clientId) {
        List<ReportDto> reports = reportService.getReportsByClient(clientId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<ReportDto>> getReportsByTrainer(@PathVariable Long trainerId) {
        List<ReportDto> reports = reportService.getReportsByTrainer(trainerId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<Report> getReportById(@PathVariable Long reportId) {
        Report report = reportService.getReportById(reportId);
        return ResponseEntity.ok(report);
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable Long reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.ok("Raport został pomyślnie usunięty.");
    }

    @GetMapping("/{reportId}/download")
    public ResponseEntity<byte[]> downloadReportAsDocx(@PathVariable Long reportId) {
        byte[] docxData = reportService.generateReportDocx(reportId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.docx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(docxData);
    }

}

