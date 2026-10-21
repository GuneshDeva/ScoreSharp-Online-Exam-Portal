package com.feuji.adminservice.repo;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.feuji.commonmodel.CodingQuestion;
import com.feuji.commonmodel.Question;

public interface CodingQuestionRepository extends JpaRepository<CodingQuestion, Long> {

	public  List<CodingQuestion> findBySubjectId(Long subjectId);
	
	public List<CodingQuestion> findByStatus(String status);

	
}
