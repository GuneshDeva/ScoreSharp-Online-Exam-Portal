package com.feuji.adminservice.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.feuji.adminservice.service.TestCasesServices;
import com.feuji.commonmodel.Question;
import com.feuji.commonmodel.TestCases;

@RestController
@CrossOrigin("*")
public class TestCasesController 
{
	@Autowired
	private TestCasesServices testCasesServices;


	@PostMapping("/addtestcases/{qid}")
	public HttpStatus insertQuestion(@RequestBody TestCases testCases, @PathVariable Long qid) {
		testCasesServices.addTestCases(testCases,qid);
		return HttpStatus.OK;
	}
	@GetMapping("/getalltestcases/{qid}")
	public List<TestCases> getAllQuestions(@PathVariable Long qid)
	{
		
		return testCasesServices.getAllTestCases(qid);
	}
	
	@PutMapping("/updatetestcases")
	public TestCases updateTestCases(@RequestBody TestCases testCases){
		
		return testCasesServices.updateTestcases(testCases);
	}
	
	@DeleteMapping("/deletetestcases/{id}")
	public HttpStatus deleteQuestion(@PathVariable Long id) {
		
		testCasesServices.deleteTestCasesById(id);
		return HttpStatus.OK;
	}

}
