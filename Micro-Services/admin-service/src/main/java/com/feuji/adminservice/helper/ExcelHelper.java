package com.feuji.adminservice.helper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.feuji.adminservice.service.SubjectService;
import com.feuji.commonmodel.Question;
import com.feuji.commonmodel.Subject;

@Component
public class ExcelHelper {
	String subName;
	String topicName;
	public List<Question> errorQuestions = new ArrayList<>();

	@Autowired
	private SubjectService subjectService;

	// cheeck that file is of excel format
	public boolean checkExcelFormat(MultipartFile file) {
		String contentType = file.getContentType();

		if (contentType != null
				&& contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
			// File is in the correct Excel format
			return true;
		} else {
			// File is not in the correct Excel format
			return false;
		}
	}

	// convert Excel to list of Questions

	public List<Question> convertExcelToListOfProduct(InputStream inputStream) {
		List<Question> questions = new ArrayList<>();
		//List<Question> errorQuestions = new ArrayList<>();

		try {
			XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
			XSSFSheet sheet = workbook.getSheet("questions");

			int rowNumber = 0;

			Iterator<Row> iterator = sheet.iterator();
			while (iterator.hasNext()) {
				Row row = iterator.next();

				if (rowNumber == 0) {
					rowNumber++;
					continue;
				}

				Iterator<Cell> cellIterator = row.iterator();
				Question question = new Question();

				while (cellIterator.hasNext()) {
					Cell cell = cellIterator.next();
					int columnIndex = cell.getColumnIndex();

					switch (columnIndex) {
					case 0:
						subName = cell.getStringCellValue();
						System.err.println(subName);
					case 1:

						topicName = cell.getStringCellValue();
						System.err.println(subName);
						System.err.println(topicName);
						Subject subject = subjectService.findSubjectByName(subName, topicName);
						question.setSubject(subject);

						break;

					case 2:
						question.setAnswer(cell.getStringCellValue());
						break;
					case 3:
						String questionContent = "<p>" + cell.getStringCellValue() + "</p>";
						questionContent = questionContent.replaceAll("\n", "<br>");
//						questionContent = questionContent.replaceAll(" ", "&nbsp;");
						question.setContent(questionContent);
						break;
					case 4:
						question.setOptionA(cell.getStringCellValue());
						break;
					case 5:
						question.setOptionB(cell.getStringCellValue());
						break;
					case 6:
						question.setOptionC(cell.getStringCellValue());
						break;
					case 7:
						question.setOptionD(cell.getStringCellValue());
						break;
					case 8:
						question.setQtype(cell.getStringCellValue());
						question.setStatus("active");

					default:
						break;
					}
				}
				
				if(question.getAnswer() == null || question.getContent() == null || question.getOptionA() == null
						|| question.getOptionB() == null || question.getOptionC() == null || question.getOptionD()== null 
						|| question.getQtype()== null || question.getSubject()== null) {
					errorQuestions.add(question);
					System.err.println(errorQuestions+"................");
					continue;
				} else {
					questions.add(question);
				}

				//questions.add(question);
				rowNumber++;
			}
			//errorQuestions();
			workbook.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return questions;
	}
	
	public List<Question> errorQuestions() {
		System.err.println(errorQuestions);
		return errorQuestions;
	}
	
	public void clearList() {
		errorQuestions.clear();
	}
	


}
