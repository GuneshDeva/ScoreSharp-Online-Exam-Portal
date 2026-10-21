package com.feuji.commonmodel;

import java.io.Serializable;

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
@Table(name = "Coding_Questions")
public class CodingQuestion implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1767910721113575660L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "content", columnDefinition = "TEXT", nullable = false)
//	@Column(name = "content", nullable = false)
	private String content;

	private String status;

//	@ManyToOne(cascade = CascadeType.ALL)		
	@ManyToOne
	@JoinColumn(name = "subject_Id", nullable = false)
	private Subject subject;

	public CodingQuestion() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CodingQuestion(Long id, String content, Subject subject) {
		super();
		this.id = id;
		this.content = content;
		this.subject = subject;
	}

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

	public Subject getSubject() {
		return subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

}
