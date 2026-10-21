package com.feuji.candidateservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.feuji.commonmodel.User;
import com.feuji.commonmodel.UserAnswers;

public interface CandidateRepository extends JpaRepository<UserAnswers, Long> {

	
	UserAnswers findByUserId(Long userId);
}
