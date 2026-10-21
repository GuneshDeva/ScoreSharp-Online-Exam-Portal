package com.feuji.adminservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.feuji.commonmodel.Marks;
import java.util.List;
public interface MarksRepository extends JpaRepository<Marks, Long>{
	
	public Marks findByUserIdAndExamId(Long userId, Long examId);

	public  List<Marks> findByUserId(Long userId);
	public List<Marks> findByExamId(Long examId);				
}