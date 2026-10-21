package com.feuji.adminservice.repo;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.feuji.commonmodel.Exam;
import com.feuji.commonmodel.Question;
import com.feuji.commonmodel.User;
import com.feuji.commonmodel.UserAnswers;

public interface UserAnswersRepository extends JpaRepository<UserAnswers, Long>{

public UserAnswers findByUserAndExamAndQuestion(User user,Exam exam,Question question);
	
List<UserAnswers> findAllByUserId(Long userId);

List<UserAnswers> findAllByUserIdAndExamId(Long uid,Long eid);

@Query(value="select question_id, user_answer from user_answers where user_id=:uid and exam_id=:eid", nativeQuery = true)
List<Map<Long,String>> findanswerbyqid(long uid, long eid); 

}