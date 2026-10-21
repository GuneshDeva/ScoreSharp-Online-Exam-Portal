package com.feuji.adminservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.feuji.adminservice.service.UserExamDetailsService;
import com.feuji.commonmodel.UserExamDetails;

@RestController
@CrossOrigin("*")
public class UserExamDetailsController {

	@Autowired
	private UserExamDetailsService detailsService;
	

	
	@PostMapping("/userExamDetails/{examId}/{userId}")
	public HttpStatus saveuserExamDetails(@RequestBody UserExamDetails userExamDetails,@PathVariable Long examId,@PathVariable Long userId)
	{
		
		detailsService.saveRecord(userExamDetails,examId,userId);
		return HttpStatus.OK;
	}
	@PutMapping("/userExamDetailsbyid/{examId}/{userId}")
	public HttpStatus updateuserExamDetails(@PathVariable Long examId,@PathVariable Long userId)
	{
		
		detailsService.updateRecord(examId,userId);
		
		return HttpStatus.OK;
	}
	@PutMapping("/userExamDetailssubmit/{examId}/{userId}")
	public HttpStatus updateuserExamDetailsAfterSubmit(@PathVariable Long examId,@PathVariable Long userId)
	{
		
		detailsService.updateRecordAfterSubmit(examId,userId);
		return HttpStatus.OK;
	}
	@GetMapping("/ExamDetails/{examId}/{userId}")
	public UserExamDetails getById(@PathVariable Long examId,@PathVariable Long userId) {
		UserExamDetails userdetails=detailsService.getById(examId,userId);
		if(userdetails==null) {
			return null;
		}
		return userdetails;	
	}
	
}
