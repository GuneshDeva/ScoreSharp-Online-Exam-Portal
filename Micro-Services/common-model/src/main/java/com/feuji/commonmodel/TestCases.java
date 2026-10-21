package com.feuji.commonmodel;

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
@Table(name = "Testcases")
public class TestCases {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "input", nullable = false)
	private String input;

	@Column(name = "expectedOutput", nullable = false)
	private String expectedOutput;

	private String status;

	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "codingQuestion_Id", nullable = false)
	private CodingQuestion codingQuestion;

	public TestCases() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TestCases(Long id, String input, String expectedOutput, CodingQuestion codingQuestion) {
		super();
		this.id = id;
		this.input = input;
		this.expectedOutput = expectedOutput;
		this.codingQuestion = codingQuestion;
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

	public String getInput() {
		return input;
	}

	public void setInput(String input) {
		this.input = input;
	}

	public String getExpectedOutput() {
		return expectedOutput;
	}

	public void setExpectedOutput(String expectedOutput) {
		this.expectedOutput = expectedOutput;
	}

	public CodingQuestion getCodingQuestion() {
		return codingQuestion;
	}

	public void setCodingQuestion(CodingQuestion codingQuestion) {
		this.codingQuestion = codingQuestion;
	}

	@Override
	public int hashCode() {
		return Objects.hash(codingQuestion, expectedOutput, id, input);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TestCases other = (TestCases) obj;
		return Objects.equals(codingQuestion, other.codingQuestion)
				&& Objects.equals(expectedOutput, other.expectedOutput) && Objects.equals(id, other.id)
				&& Objects.equals(input, other.input);
	}

}
