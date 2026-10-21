package com.feuji.adminservice.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.feuji.adminservice.repo.ExamRepository;
import com.feuji.adminservice.repo.QuestionRepository;
import com.feuji.adminservice.repo.UserAnswersRepository;
import com.feuji.adminservice.utils.AdminServiceUtil;
import com.feuji.commonmodel.Exam;
import com.feuji.commonmodel.Question;
import com.feuji.commonmodel.User;
import com.feuji.commonmodel.UserAnswers;

@Service
public class UserAnswersService {

	@Autowired
	private UserAnswersRepository userAnswersRepository;
	@Autowired
	private ExamRepository examRepository;
	@Autowired
	private QuestionRepository questionRepository;

	private RestTemplate restTemplate;

//	@Autowired
	private AdminServiceUtil adminServiceUtil;

	public UserAnswersService(@Value("${base.url}") String adressBaseUrl, RestTemplateBuilder builder,
			AdminServiceUtil adminServiceUtil) {
		this.adminServiceUtil = adminServiceUtil;
		System.out.println(adressBaseUrl);
		String url = adminServiceUtil.getUrl(adressBaseUrl);
		System.err.println(url);
		this.restTemplate = builder.rootUri(url).build();
		System.out.println(adressBaseUrl);
	}

	public void saveAnswer(UserAnswers userAnswers, Long eid, Long qid, Long uid) {
		Exam exam = examRepository.findById(eid).get();
		Question question = questionRepository.findById(qid).get();
		User user = restTemplate.getForObject("/getUserById/{uid}", User.class, uid);

		UserAnswers answers = userAnswersRepository.findByUserAndExamAndQuestion(user, exam, question);

		if (answers != null) {
			answers.setUserAnswer(userAnswers.getUserAnswer());
			System.out.println(answers.getUserAnswer());
			userAnswersRepository.saveAndFlush(answers);
		} else {
			userAnswersRepository.save(userAnswers);
		}

	}

	public List<UserAnswers> getAnswers() {

		return userAnswersRepository.findAll();
	}

	public List<UserAnswers> getUserAnswers(Long uid) {

		return userAnswersRepository.findAllByUserId(uid);
	}

	public List<UserAnswers> getanswers(Long uid, Long eid) {

		return userAnswersRepository.findAllByUserIdAndExamId(uid, eid);
	}

	public List<Map<Long, String>> getanswerbyqustion(long uid, long eid) {
		return userAnswersRepository.findanswerbyqid(uid, eid);
	}

}