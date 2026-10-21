package com.feuji.adminservice.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.feuji.adminservice.service.CreatePaperService;
import com.feuji.commonmodel.CreatePaper;
import com.feuji.commonmodel.Question;
import com.feuji.commonmodel.Subject;

@RestController
@CrossOrigin("*")
public class CreatePaperController
{
	@Autowired
	private CreatePaperService createPaperService;
	
	@PostMapping("/addpaper")
	public HttpStatus addPaper(@RequestBody CreatePaper createPaper)
	{
		createPaperService.addPaper(createPaper);
		return HttpStatus.OK;
	}
	
	
	@GetMapping("/getpaper")
	public List<CreatePaper> getPaper()
	{
		return createPaperService.getPaper();
	}
	
	@PutMapping("/updatepaper/{id}")
	public void update(@RequestBody CreatePaper createPaper ,@PathVariable Long id)
	{
		createPaperService.updatePaper(createPaper,id);
	}
	
	@GetMapping("/subjectsbypaper/{pId}")
	public Set<Subject> getSubjectsByPaperId(@PathVariable Long pId)
	{
		return createPaperService.getSubjectsByPaperId(pId);
	}

	@PostMapping("/questionsbypaper")
	public Set getQuestionsByPaperId(@RequestBody CreatePaper createPaper) {
		
		return createPaperService.getPaperById(createPaper);
	}
	
	@DeleteMapping("/deletePaper/{id}")
	public HttpStatus deletePaper(@PathVariable Long id) {
		createPaperService.deletebyid(id);
		return HttpStatus.OK;
	}
	
}










