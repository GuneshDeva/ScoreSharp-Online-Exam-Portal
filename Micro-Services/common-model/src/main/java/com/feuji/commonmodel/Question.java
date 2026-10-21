package com.feuji.commonmodel;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "question_table")
public class Question implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4650257712444303979L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "content", nullable = false)
	private String content;

	@Column(name = "option_A", nullable = false)
	private String optionA;

	@Column(name = "option_B", nullable = false)
	private String optionB;

	@Column(name = "option_C", nullable = false)
	private String optionC;

	@Column(name = "option_D", nullable = false)
	private String optionD;

	private String answer;

	@Column(name = "q_type", nullable = false)
	private String qtype;

	private String status;

	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinColumn(name = "s_Id", nullable = false)
	private Subject subject;


	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getOptionA() {
		return optionA;
	}

	public void setOptionA(String optionA) {
		this.optionA = optionA;
	}

	public String getOptionB() {
		return optionB;
	}

	public void setOptionB(String optionB) {
		this.optionB = optionB;
	}

	public String getOptionC() {
		return optionC;
	}

	public void setOptionC(String optionC) {
		this.optionC = optionC;
	}

	public String getOptionD() {
		return optionD;
	}

	public void setOptionD(String optionD) {
		this.optionD = optionD;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public String getQtype() {
		return qtype;
	}

	public void setQtype(String qtype) {
		this.qtype = qtype;
	}

	public Subject getSubject() {
		return subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

//	public Set<CreatePaper> getExams() {
//		return exams;
//	}
//
//	public void setExams(Set<CreatePaper> exams) {
//		this.exams = exams;
//	}

	public Question() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Question(Long id, String content, String optionA, String optionB, String optionC, String optionD,
			String answer, String qtype, Subject subject) {
		super();
		this.id = id;
		this.content = content;
		this.optionA = optionA;
		this.optionB = optionB;
		this.optionC = optionC;
		this.optionD = optionD;
		this.answer = answer;
		this.qtype = qtype;
		this.subject = subject;
		// this.exams = exams;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		Question question = (Question) o;
		return Objects.equals(id, question.id) && Objects.equals(content, question.content)
				&& Objects.equals(optionA, question.optionA) && Objects.equals(optionB, question.optionB)
				&& Objects.equals(optionC, question.optionC) && Objects.equals(optionD, question.optionD)
				&& Objects.equals(answer, question.answer) && Objects.equals(qtype, question.qtype)
				&& Objects.equals(subject, question.subject);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, content, optionA, optionB, optionC, optionD, answer, qtype, subject);
	}
}
