package com.feuji.adminservice.repo;

import com.feuji.commonmodel.Exam;
import java.time.LocalDateTime;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ExamRepository extends JpaRepository<Exam, Long>{
	
	 public Exam findByCode(String code);

	public List<Exam> findByStatus(String string);
	
	public List<Exam> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

}
