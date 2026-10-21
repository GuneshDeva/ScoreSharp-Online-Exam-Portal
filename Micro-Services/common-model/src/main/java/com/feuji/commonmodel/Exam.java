
package com.feuji.commonmodel;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "scheduled_exam_table")
public class Exam {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@Column(name = "exam_code", unique = true)
	private String code;

	private LocalDateTime startTime;

	private LocalDateTime endTime;

	private int examDuration;

	private String status;

	private boolean showResults;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "paper_id")
	private CreatePaper createPaper;

	public Exam() {
	}

	public Exam(String name, String code, LocalDateTime startTime, LocalDateTime endTime, CreatePaper createPaper,
			int examDuration) {
		this.name = name;
		this.code = code;
		this.startTime = startTime;
		this.endTime = endTime;
		this.createPaper = createPaper;
		this.examDuration = examDuration;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getExamDuration() {
		return examDuration;
	}

	public void setExamDuration(int examDuration) {
		this.examDuration = examDuration;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public LocalDateTime getStartTime() {
		return startTime;
	}

	public void setStartTime(LocalDateTime startTime) {
		this.startTime = startTime;
	}

	public LocalDateTime getEndTime() {
		return endTime;
	}

	public void setEndTime(LocalDateTime endTime) {
		this.endTime = endTime;
	}

	public CreatePaper getCreatePaper() {
		return createPaper;
	}

	public void setCreatePaper(CreatePaper createPaper) {
		this.createPaper = createPaper;
	}

	public boolean getShowResults() {
		return showResults;
	}

	public void setShowResults(boolean showResults) {
		this.showResults = showResults;
	}
}
