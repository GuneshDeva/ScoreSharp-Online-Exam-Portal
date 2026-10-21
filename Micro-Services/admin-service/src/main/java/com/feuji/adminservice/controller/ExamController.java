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

import com.feuji.adminservice.service.ExamService;
import com.feuji.commonmodel.Exam;
import com.feuji.commonmodel.Subject;

@RestController
@CrossOrigin("*")
public class ExamController {
	@Autowired
	private ExamService examService;

	@PostMapping("/addexam/{pid}")
	public HttpStatus addexam(@RequestBody Exam exam, @PathVariable Long pid) {
		System.out.println(exam.getShowResults());
		examService.addExam(exam, pid);
		return HttpStatus.OK;
	}

	@PutMapping("/updateexam/{id}")
	public void update(@RequestBody Exam exam, @PathVariable Long id) {
		examService.updateExam(exam, id);
	}

	@GetMapping("/getallexams")
	public List<Exam> getAllExams() {
		return examService.getAll();
	}

	@GetMapping("/getexambycode/{code}")
	public Exam getExamByCode(@PathVariable String code) {
		return examService.getExamByCode(code);
	}

	@GetMapping("/getquestions/{sid}")
	public Exam get(@PathVariable Long sid) {
		return examService.getbySid(sid);
	}

	@PostMapping("/getsubjectsBycode/{code}")
	public Set<Subject> getSubjectsByCode(@PathVariable String code) {
		System.out.println(code);
		return examService.getSubjectsByCode(code);

	}

	@GetMapping("/getquestionsBySubjectId/{sid}/{code}")
	public Set getQuestionsBySubjectId(@PathVariable Long sid, @PathVariable String code) {
		System.out.println(code);
		return examService.getQuestionsBySubjectId(sid, code);

	}

	@GetMapping("/getquestionsBySubjectId/{code}")
	public Set getAllQuestionsByCode(@PathVariable String code) {
		System.out.println(code);
		return examService.getAllQuestionsByCode(code);

	}

	@GetMapping("/getexam/{id}")
	public Exam getExam(@PathVariable Long id) {
		return examService.getExamById(id);
	}

	@DeleteMapping("/deleteExam/{id}")
	public HttpStatus deleteexam(@PathVariable Long id) {
		examService.deletebyid(id);
		return HttpStatus.OK;
	}
	
	@GetMapping("/getexamsbyyear/{year}")
	public List<Exam> getExamsByYear(@PathVariable int year) {
	    return examService.getExamsByYear(year);
	}

}
