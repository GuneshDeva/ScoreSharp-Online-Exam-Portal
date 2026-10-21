package com.feuji.adminservice.service;

import com.feuji.adminservice.repo.SubjectRepository;
import com.feuji.commonmodel.Subject;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class SubjectService {
	@Autowired
	private SubjectRepository subjectRepository;
	
	public boolean addSubject(Subject subject)
	{
		Subject subject1=subjectRepository.findSubjectByNameAndDescription(subject.getName(), subject.getDescription());
		subject.setStatus("active");

		if(subject1==null) {
			subjectRepository.save(subject);
			return true;
		}
		
		return false;
	}
	
	public List<Subject> getAll() {
		return subjectRepository.findByStatus("active");
	}
	
	public void updateSubject(Subject subject,Long id) {
		Subject subject1=subjectRepository.findById(id).get();
		subject1.setName(subject.getName());
    	subject1.setDescription(subject.getDescription());
		subjectRepository.saveAndFlush(subject1);
	}
	public Subject getSubjectById(Long id) {
		return subjectRepository.findById(id).get();
		
	}
	public void deleteSubject(Long id) {
		Subject subject1=subjectRepository.findById(id).get();
		subject1.setStatus("inactive");
		subjectRepository.saveAndFlush(subject1);
		
	}
	public Subject findSubjectByName(String name,String topicName) {
		return subjectRepository.findSubjectByNameAndDescription(name,topicName);
	}
	

}
