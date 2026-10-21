package com.feuji.adminservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.feuji.adminservice.repo.CodingQuestionRepository;
import com.feuji.adminservice.repo.ExamRepository;
import com.feuji.adminservice.repo.QuestionRepository;
import com.feuji.adminservice.repo.UserCodeRepository;
import com.feuji.commonmodel.CodingQuestion;
import com.feuji.commonmodel.Exam;
import com.feuji.commonmodel.Question;
import com.feuji.commonmodel.User;
import com.feuji.commonmodel.UserCode;

@Service
public class UserCodeService 
{
	
	@Autowired
	private UserCodeRepository userCodeRepository;
	
	@Autowired
	private ExamRepository examRepository;
	
	@Autowired
	private  CodingQuestionRepository codingQuestionRepository;
	
	private RestTemplate restTemplate;

	
	public UserCodeService(@Value("${base.url}") String adressBaseUrl,RestTemplateBuilder builder)
	{
		System.out.println(adressBaseUrl);
		this.restTemplate=
				builder.
				rootUri(adressBaseUrl)
				.build();
		System.out.println(adressBaseUrl);	
	}
	

	public List<UserCode> getAnswers()
	{
		List<UserCode> list=userCodeRepository.findAll();
		list.stream().forEach((userCode)->{
			userCode.setUserInputCode(new String(userCode.getCode()));
		});
		return list;
	}
	

	public List<UserCode> getUserAnswers(Long uid,Long eid)
	{
	    List<UserCode> list = userCodeRepository.findByUserIdAndExamId(uid, eid);

	    list.forEach(userCode -> {
	        if (userCode.getCode() != null) {
	            userCode.setUserInputCode(new String(userCode.getCode()));
	        }
	    });

	    return list;
	}
	


	public void saveCode(UserCode userCode, Long eid, Long qid, Long uid)
	{
	    Exam exam = examRepository.findById(eid).get();

	    CodingQuestion codingQuestion =
	            codingQuestionRepository.findById(qid).get();

	    User user =
	            restTemplate.getForObject("/getUserById/{uid}", User.class, uid);

	    // Set the actual database entities into UserCode
	    userCode.setUser(user);
	    userCode.setExam(exam);
	    userCode.setCodingQuestion(codingQuestion);

	    UserCode code =
	            userCodeRepository.findByUserAndExamAndCodingQuestion(
	                    user, exam, codingQuestion);

	    System.out.println("================");

	    if (code != null)
	    {
	        code.setCode(userCode.getCode());
	        code.setLanguage(userCode.getLanguage());
	        code.setIscorrect(userCode.getIscorrect());

	        userCodeRepository.saveAndFlush(code);
	    }
	    else
	    {
	        userCodeRepository.saveAndFlush(userCode);
	    }
	}

}
