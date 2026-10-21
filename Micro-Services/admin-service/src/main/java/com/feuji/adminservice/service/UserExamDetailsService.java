package com.feuji.adminservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.feuji.adminservice.repo.ExamRepository;
import com.feuji.adminservice.repo.UserExamDetailsRepository;
import com.feuji.commonmodel.Exam;
import com.feuji.commonmodel.User;
import com.feuji.commonmodel.UserExamDetails;

@Service
public class UserExamDetailsService {

	@Autowired
	private UserExamDetailsRepository examDetailsRepository;
	@Autowired
	private ExamRepository examRepository;
	private RestTemplate restTemplate;
	
	
	public UserExamDetailsService(@Value("${base.url}") String adressBaseUrl,RestTemplateBuilder builder)
	{
		System.out.println(adressBaseUrl);
		this.restTemplate=
				builder.
				rootUri(adressBaseUrl)
				.build();
		System.out.println(adressBaseUrl);	
	}
	

	private User user;
	private Exam exam;

	public void send(User user, Exam exam) {
		this.user = user;
		this.exam = exam;
		System.out.println("in send"+exam.getExamDuration());

	}

	public void saveRecord(UserExamDetails userExamDetails,Long examId,Long userId) {
		Exam exam1=examRepository.findById(examId).get();
		User user1=restTemplate.getForObject("/getUserById/{uid}",User.class,userId);
		userExamDetails.setUser(user1);
		userExamDetails.setExam(exam1);
		userExamDetails.setLoginTime(java.time.LocalTime.now());
		userExamDetails.setLogoutTime(java.time.LocalTime.now());
		userExamDetails.setExamDuration(exam1.getExamDuration());
			userExamDetails.setStatus("inprogress");
		examDetailsRepository.save(userExamDetails);
	}

	public UserExamDetails updateRecord(Long examId,Long userId) {
		UserExamDetails userExamDetails2 = examDetailsRepository.findByUserIdAndExamId(userId,
				examId);
		System.out.println(userExamDetails2);
//		UserExamDetails userExamDetails2=examDetailsRepository.findByUserIdAndExamId(2L, 1L);
		if (userExamDetails2 != null) {

			userExamDetails2.setLogoutTime(java.time.LocalTime.now());
			return examDetailsRepository.saveAndFlush(userExamDetails2);
		} else {
			return userExamDetails2;
		}
	}

	public UserExamDetails updateRecordAfterSubmit(Long examId,Long userId) {
		UserExamDetails userExamDetails2 = examDetailsRepository.findByUserIdAndExamId(userId,
				examId);
//		UserExamDetails userExamDetails2=examDetailsRepository.findByUserIdAndExamId(2L, 1L);
		if (userExamDetails2 != null) {
			userExamDetails2.setLogoutTime(java.time.LocalTime.now());
			userExamDetails2.setStatus("completed");
			return examDetailsRepository.saveAndFlush(userExamDetails2);
		} else {
			return userExamDetails2;
		}
	}
	public UserExamDetails getById(Long examId,Long userId) {
		 UserExamDetails userExamDetails2 = examDetailsRepository.findByUserIdAndExamId(userId,
				 examId);
		 System.out.println("userExamDetails2"+userExamDetails2);
		 return userExamDetails2;
	}

}
