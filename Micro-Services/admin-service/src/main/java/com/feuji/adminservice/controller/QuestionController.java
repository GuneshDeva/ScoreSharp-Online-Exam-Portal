package com.feuji.adminservice.controller;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.feuji.adminservice.helper.ExcelHelper;
import com.feuji.adminservice.helper.JavaToExcel;
import com.feuji.adminservice.service.QuestionService;
import com.feuji.commonmodel.Question;

@RestController
@CrossOrigin("*")
public class QuestionController {
	@Autowired
	private QuestionService questionService;

	@Autowired
	private ExcelHelper excelHelper;

	@Autowired
	private JavaToExcel javaToExcel;

	@PostMapping("/addquestion/{sid}")
	public HttpStatus insertQuestion(@RequestBody Question question, @PathVariable Long sid) {
		questionService.addquestion(question, sid);
		return HttpStatus.OK;
	}

	@GetMapping("/getallquestions/{sid}")
	public Set<Question> getAllQuestions(@PathVariable Long sid) {

		return questionService.getAllQuestions(sid);
	}

	@PutMapping("/updatequestion")
	public Question updateQuestion(@RequestBody Question question) {

		return questionService.updatequestions(question);
	}

	@GetMapping("/getquestionbyid/{id}")
	public Question getQuestionById(@PathVariable Long id) {
		return questionService.getQuestionById(id);

	}

	@DeleteMapping("/deleteQuestion/{id}")
	public HttpStatus deleteQuestion(@PathVariable Long id) {
		questionService.deleteQuestionById(id);
		return HttpStatus.OK;
	}

	@PostMapping("/questions/upload")
	public ResponseEntity<String> uploadExcel(@RequestParam("file") MultipartFile file, HttpServletResponse response)
			throws IOException {
		if (excelHelper.checkExcelFormat(file)) {
			try {

				questionService.excelSave(file);
				exportToExcel(response);
				return ResponseEntity.ok().body("File uploaded and questions saved ");
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			return ResponseEntity.ok().body("please upload excel file only");
		}

		return ResponseEntity.ok("issue");
	}

	public void exportToExcel(HttpServletResponse response) throws IOException {
		response.setContentType("application/octet-stream");
		DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
		String currentDateTime = dateFormatter.format(new Date());

		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=errors_" + currentDateTime + ".xlsx";
		response.setHeader(headerKey, headerValue);

		List<Question> listerrorQuestions = excelHelper.errorQuestions();
		JavaToExcel excelExporter = new JavaToExcel(listerrorQuestions);

		excelExporter.export(response);
		excelHelper.errorQuestions.clear();

	}

}
