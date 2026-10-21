package com.feuji.candidateservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.feuji.candidateservice.service.CandidateService;

@RestController
@CrossOrigin("*")
public class CandidateController 
{
	
	@Autowired
	private CandidateService candidateService;
	
	@GetMapping("/getScore/{uid}/{eid}")
	public Long getScore(@PathVariable Long uid,@PathVariable Long eid)
	{
		return candidateService.getuserScore(uid,eid);
	}
}
