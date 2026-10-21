package com.feuji.adminservice.repo;

import java.util.Set;

import com.feuji.commonmodel.Question;
import org.springframework.data.jpa.repository.JpaRepository;


public interface QuestionRepository extends JpaRepository<Question, Long>{

	public  Set<Question> findBySubjectId(Long subjectId);

	
}
