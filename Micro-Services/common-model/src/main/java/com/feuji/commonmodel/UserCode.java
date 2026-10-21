package com.feuji.commonmodel;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "user_code")
public class UserCode implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String language;

	// @JsonDeserialize(using = BlobDeserializer.class)
	// private Blob code;
	@Lob
	private byte[] code;

	@Transient
	private String userInputCode;

	@ManyToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "exam_id")
	private Exam exam;

	@ManyToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "question_id")
	private CodingQuestion codingQuestion;

	private String iscorrect;

	public UserCode() {
		super();
	}

	public UserCode(int id, String language, byte[] code, User user, Exam exam, CodingQuestion codingQuestion,
			String iscorrect) {
		super();
		this.id = id;
		this.language = language;
		this.code = code;
		this.user = user;
		this.exam = exam;
		this.codingQuestion = codingQuestion;
		this.iscorrect = iscorrect;
	}

	public String getIscorrect() {
		return iscorrect;
	}

	public void setIscorrect(String iscorrect) {
		this.iscorrect = iscorrect;
	}

	public String getUserInputCode() {
		return userInputCode;
	}

	public void setUserInputCode(String userInputCode) {
		this.userInputCode = userInputCode;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Exam getExam() {
		return exam;
	}

	public void setExam(Exam exam) {
		this.exam = exam;
	}

	public CodingQuestion getCodingQuestion() {
		return codingQuestion;
	}

	public void setCodingQuestion(CodingQuestion codingQuestion) {
		this.codingQuestion = codingQuestion;
	}

	public byte[] getCode() {
		return code;
	}

	public void setCode(byte[] code) {
		this.code = code;
	}

}
