package com.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class FindyApplication {

	public static void main(String[] args) {
		SpringApplication.run(FindyApplication.class, args);
	}
}
