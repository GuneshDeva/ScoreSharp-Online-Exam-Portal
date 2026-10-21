package com.feuji.candidateservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;



@SpringBootApplication
@EntityScan(basePackages = "com.feuji.commonmodel")
public class CandidateServiceApplication {
	

	public static void main(String[] args) {
		SpringApplication.run(CandidateServiceApplication.class, args);
	}


}
