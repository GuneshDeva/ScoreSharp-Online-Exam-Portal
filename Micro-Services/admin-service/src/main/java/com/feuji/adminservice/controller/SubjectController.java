package com.feuji.adminservice.controller;

import com.feuji.adminservice.service.SubjectService;
import com.feuji.commonmodel.Subject;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin("*")
public class SubjectController {
	@Autowired
	private SubjectService subjectService;
	
	@PostMapping("/subject")
	public ResponseEntity<String> addSubject(@RequestBody Subject subject)
	{
		boolean check=subjectService.addSubject(subject);
		if(check) {
			return ResponseEntity.ok("");
		}
		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	            .body("");
	}

	@PutMapping("/subject/{id}")
	public HttpStatus updateSubject( @PathVariable Long id, @RequestBody Subject subject)
	{
		subjectService.updateSubject(subject, id);
		System.out.println(subject.getName()+"  "+subject.getDescription());
		return HttpStatus.OK;
	}
	
	@GetMapping("/subjects")
	public List<Subject> getAll()
	{
		List<Subject> list=subjectService.getAll();
		
		return list;
	}

	@GetMapping("/subject/{id}")
	public Subject getSubjectById(@PathVariable Long id) {
		return subjectService.getSubjectById(id);
	}

	@DeleteMapping("/subject/{id}")
	public HttpStatus deleteSubject(@PathVariable Long id) {
		 subjectService.deleteSubject(id);;
		return HttpStatus.OK;
	}

	

}
