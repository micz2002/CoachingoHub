package com.jf.coachingohub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CoachingohubApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoachingohubApplication.class, args);
	}

}
