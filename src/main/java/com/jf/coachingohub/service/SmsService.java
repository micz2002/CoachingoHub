package com.jf.coachingohub.service;

import com.jf.coachingohub.config.TwilioConfig;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    private final TwilioConfig twilioConfig;

    public SmsService(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
    }

    public void sendSms(String toPhoneNumber, String message) {
        Message.creator(
                new PhoneNumber(toPhoneNumber), // Numer odbiorcy
                new PhoneNumber(twilioConfig.getPhoneNumber()), // Numer Twilio
                message // Treść wiadomości
        ).create();
    }
}
