package com.feuji.adminservice.service;

import java.util.Optional;				
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.feuji.adminservice.repo.CodingQuestionRepository;
import com.feuji.adminservice.repo.SubjectRepository;
import com.feuji.commonmodel.CodingQuestion;
import com.feuji.commonmodel.Question;
import com.feuji.commonmodel.Subject;

@Service
public class CodingQuestionService 
{
	@Autowired
	private CodingQuestionRepository codingQuestionRepository;
	
	@Autowired
	private SubjectRepository subjectRepository;
	
	public CodingQuestion addquestion(CodingQuestion codingQuestion, Long sid) {		

	    Subject subject = subjectRepository.findById(sid).get();

	    codingQuestion.setSubject(subject);
	    codingQuestion.setStatus("active");

	    return codingQuestionRepository.save(codingQuestion);
	}
	
	
	public List<CodingQuestion> getAllQuestions() {
		List<CodingQuestion> set =  codingQuestionRepository.findByStatus("active");
		return set;
	}
	
	public List<CodingQuestion> getAllCodingQuestions(Long sid) {
		List<CodingQuestion> set =  codingQuestionRepository.findBySubjectId(sid);
		return set;
	}
	public void deleteQuestionById(Long id) {

		CodingQuestion question = codingQuestionRepository.findById(id).get();
		question.setStatus("inactive");

		codingQuestionRepository.saveAndFlush(question);
	}
	
	
	
	public CodingQuestion getCodingQuestionById(Long id) {
	    Optional<CodingQuestion> codingQuestion =
	            codingQuestionRepository.findById(id);

	    if (codingQuestion.isPresent()) {
	        return codingQuestion.get();
	    }

	    return null;
	}

	
	public CodingQuestion updateCodingQuestion(CodingQuestion codingQuestion) {

	    CodingQuestion existingQuestion =
	            codingQuestionRepository.findById(codingQuestion.getId()).orElse(null);

	    if (existingQuestion != null) {

	        existingQuestion.setContent(codingQuestion.getContent());

	        return codingQuestionRepository.save(existingQuestion);
	    }

	    return null;
	}
}
