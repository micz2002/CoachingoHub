package com.jf.coachingohub.controller;

import com.jf.coachingohub.service.SmsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-sms")
public class TestSmsController {

    private final SmsService smsService;

    public TestSmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping
    public String sendTestSms(@RequestParam String toPhoneNumber, @RequestParam String message) {
        smsService.sendSms(toPhoneNumber, message);
        return "Test SMS wysłany na numer: " + toPhoneNumber;
    }
}
