package com.feuji.adminservice.repo;

import com.feuji.commonmodel.Subject;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface SubjectRepository extends JpaRepository<Subject, Long> {
	
	public List<Subject> findByStatus(String status);
	public Subject findSubjectByNameAndDescription(String name,String description);


}
