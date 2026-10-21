package com.feuji.adminservice.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.feuji.commonmodel.CodingQuestion;
import com.feuji.commonmodel.Exam;
import com.feuji.commonmodel.User;
import com.feuji.commonmodel.UserCode;

public interface UserCodeRepository extends JpaRepository<UserCode, Long>{
	
	 UserCode findByUserAndExamAndCodingQuestion(User user,Exam exam,CodingQuestion codingQuestion);
	
	List<UserCode> findAllByUserId(Long userId);

	List<UserCode> findAllByUserIdAndExamId(Long uid,Long eid);


	 List<UserCode> findByUserIdAndExamId(Long userId, Long examId);
}
