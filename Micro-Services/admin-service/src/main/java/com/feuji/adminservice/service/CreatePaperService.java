package com.feuji.adminservice.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.feuji.adminservice.repo.CodingQuestionRepository;
import com.feuji.adminservice.repo.CreatePaperRepository;
import com.feuji.adminservice.repo.QuestionRepository;
import com.feuji.commonmodel.CodingQuestion;
import com.feuji.commonmodel.CreatePaper;
import com.feuji.commonmodel.Question;
import com.feuji.commonmodel.Subject;

@Service
public class CreatePaperService 
{
	@Autowired
	private CreatePaperRepository createPaperRepository;
	
	@Autowired
	private QuestionRepository questionRepository;
	
	@Autowired
	private CodingQuestionRepository codingQuestionRepository;
	
	public void addPaper(CreatePaper createPaper)
	{
		createPaper.setStatus("active");

		Set<Question> questionsSet=new HashSet<>();
		
		Set<CodingQuestion> codingQuestionsSet=new HashSet<>();

		if(createPaper.getQuestionsListArray()!=null) {
			
			Arrays.asList(createPaper.getQuestionsListArray()).stream().forEach((id) -> {
				Question question =questionRepository.findById(id).get();
				questionsSet.add(question);
			});
			createPaper.setQuestions(questionsSet);
			
		}
		
		if(createPaper.getCodingQuestionsListArray()!=null) {
			
			Arrays.asList(createPaper.getCodingQuestionsListArray()).stream().forEach((id) -> {
				CodingQuestion codingQuestion =codingQuestionRepository.findById(id).get();
				codingQuestionsSet.add(codingQuestion);
			});
			createPaper.setCodingQuestions(codingQuestionsSet);
		}
		
		createPaperRepository.save(createPaper);
	}
	
	
	
	public List<CreatePaper> getPaper()
	{
		return createPaperRepository.findByStatus("active");
	}
	
	public void updatePaper(CreatePaper createPaper,Long id) 
	{
	
		CreatePaper paper=createPaperRepository.findById(id).get();
		
		paper.setName(createPaper.getName());
		paper.setTotalMarks(createPaper.getTotalMarks());
		paper.setQuestions(createPaper.getQuestions());
		createPaperRepository.saveAndFlush(paper);

	}
	
	public Set<Subject> getSubjectsByPaperId(Long pid)
	{
		CreatePaper paper= createPaperRepository.findById(pid).get();
		Set<Subject> set=new HashSet<>();
		set.addAll(paper.getQuestions().stream().map((s)->s.getSubject()).collect(Collectors.toSet())); 
		set.addAll(paper.getCodingQuestions().stream().map((s)->s.getSubject()).collect(Collectors.toSet()));
		return set;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Set getPaperById(CreatePaper createPaper) {
		Set set=new HashSet<>();
		CreatePaper paper= createPaperRepository.findById(createPaper.getId()).get();
		paper.getQuestions().stream().forEach(e->set.add(e));
		paper.getCodingQuestions().stream().forEach(e->set.add(e));
		return set;
	}
	
	public void deletebyid(Long id)
	{
		CreatePaper paper= createPaperRepository.findById(id).get();
		paper.setStatus("inactive");
		createPaperRepository.saveAndFlush(paper);
	}

}
