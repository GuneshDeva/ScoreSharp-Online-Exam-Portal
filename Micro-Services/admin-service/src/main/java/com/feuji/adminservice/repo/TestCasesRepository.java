package com.feuji.adminservice.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.feuji.commonmodel.TestCases;

public interface TestCasesRepository extends JpaRepository<TestCases, Long>{

	List<TestCases> findByCodingQuestionId(Long codingQuestionId);

	
}
