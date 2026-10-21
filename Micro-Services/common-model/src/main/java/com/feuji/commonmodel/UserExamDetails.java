package com.feuji.commonmodel;

import java.time.LocalTime;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PostLoad;
import javax.persistence.Table;

@Entity
@Table(name = "user_exam_details")
public class UserExamDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "user_id")
	private User user;
	
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "exam_id")
	private Exam exam;
	
	private LocalTime loginTime;
	
	
	private LocalTime logoutTime;
	
	private int examDuration;
	
	private String status;
	
	

	

	public UserExamDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserExamDetails(int id, User user, Exam exam, LocalTime loginTime, LocalTime logoutTime, int examDuration,
			String status) {
		super();
		this.id = id;
		this.user = user;
		this.exam = exam;
		this.loginTime = loginTime;
		this.logoutTime = logoutTime;
		this.examDuration = examDuration;
		this.status = status;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public LocalTime getLoginTime() {
		return loginTime;
	}

	public void setLoginTime(LocalTime loginTime) {
		this.loginTime = loginTime;
	}

	public LocalTime getLogoutTime() {
		return logoutTime;
	}

	public void setLogoutTime(LocalTime logoutTime) {
		this.logoutTime = logoutTime;
	}

	public int getExamDuration() {
		return examDuration;
	}

	public void setExamDuration(int examDuration) {
		this.examDuration = examDuration;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "UserExamDetails [id=" + id + ", user=" + user + ", exam=" + exam + ", loginTime=" + loginTime
				+ ", logoutTime=" + logoutTime + ", examDuration=" + examDuration + ", status=" + status + "]";
	}

	
	 
	
}