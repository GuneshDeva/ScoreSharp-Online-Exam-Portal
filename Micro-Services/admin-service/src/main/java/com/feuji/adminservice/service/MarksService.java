package com.feuji.adminservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.feuji.adminservice.repo.MarksRepository;
import com.feuji.commonmodel.Exam;
import com.feuji.commonmodel.Marks;

@Service
public class MarksService {
	@Autowired
	private MarksRepository marksRepository;

	public void addMarks(Marks marks) {
		Marks existingMarks = marksRepository.findByUserIdAndExamId(marks.getUser().getId(), marks.getExam().getId());
		if(existingMarks == null) {
			marksRepository.save(marks);
		}
	}

	
	public List<Marks> getMarks() {
		return marksRepository.findAll();
	}

	public boolean isUserWrittenExam(Long userId, Long examId) {

		Marks marks = marksRepository.findByUserIdAndExamId(userId, examId);
		if (marks == null) {
			return false;
		} else {
			return true;
		}
	}
	
	public  List<Marks> getMarksByUserId(Long userId) {
		return marksRepository.findByUserId(userId);
	}
	
	
	

	
	public List<Marks> getMarksByExamId(Long examId) {
	    return marksRepository.findByExamId(examId);
	}

}