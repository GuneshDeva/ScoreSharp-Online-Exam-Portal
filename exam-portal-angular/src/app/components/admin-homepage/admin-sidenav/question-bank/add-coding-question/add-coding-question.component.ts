import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { CodingQuestion } from 'src/app/model/model/CodingQuestion';
import { Subject } from 'src/app/model/model/Subject';
import { TestCases } from 'src/app/model/model/TestCases';
import { SubjectService } from 'src/app/services/subject.service';
import Swal from 'sweetalert2';
interface InputField {
  // value: string;
  input: string;
  output: string;
}

@Component({
  selector: 'app-add-coding-question',
  templateUrl: './add-coding-question.component.html',
  styleUrls: ['./add-coding-question.component.css'],
})
export class AddCodingQuestionComponent {
  @Output('loadAddCodingQuestionPage') loadAddCodingQuestionPage =
    new EventEmitter();

  subjects?: Subject[];
  uniqueSubjectNames: string[] = [];
  codingQuestion: CodingQuestion = new CodingQuestion();
  testCases: TestCases = new TestCases();
  testCasesArray: TestCases[] = [];
  questionForm: FormGroup;
  subjectControl = new FormControl();
  selectedsubject?: string;
  subject_id?: number;
  questionContent?: string;
  inputs: InputField[] = [];
  filteredTopics: Subject[] = [];
  codingQuestionId?: number;
  getCodingQuestion: CodingQuestion[] = [];
  testcases: TestCases[] = [];
  public Editor = ClassicEditor;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private subjectService: SubjectService
  )
  {
    this.questionForm = this.formBuilder.group({
      question: '',
      options: this.formBuilder.array([this.createOption()]),
    });
  }

  ngOnInit(): void {
    this.subjectService.fetchSubjects().subscribe((data) => {
      this.subjects = data;
      this.uniqueSubjectNames = this.getUniqueSubjectNames(this.subjects);
    });
  }



  getUniqueSubjectNames(subjects: Subject[]): string[] {
  const uniqueSubjectNames = subjects
    .map(subject => subject?.name)
    .filter(
      (name): name is string =>
        name !== undefined &&
        name.trim().toLowerCase() === 'coding'
    );

  return [...new Set(uniqueSubjectNames)];
}




  onSubjectSelection() {
  if (this.selectedsubject) {
    this.filteredTopics = this.subjects!.filter(
      subject =>
        subject.name?.trim().toLowerCase() ===
        this.selectedsubject?.trim().toLowerCase()
    );

    console.log("Selected subject:", this.selectedsubject);
    console.log("Filtered topics:", this.filteredTopics);
  }
}

  addInput() {
    this.inputs.push({ input: '', output: '' });
  }

  removeInput() {
    this.inputs.pop();
  }

  createOption(): FormGroup {
    return this.formBuilder.group({
      value: '',
      isCorrect: false,
    });
  }





    onSubmit(id?: number): void {
  this.codingQuestion.content = this.questionContent;

  this.http
    .post<CodingQuestion>(
      `http://localhost:9033/api/subject/${id}/codingquestion`,
      this.codingQuestion
    )
    .subscribe(
      (response) => {

        this.codingQuestionId = response.id;

        this.addTestCases();

        Swal.fire('Question added successfully', '', 'success');

        this.clearForm();
        this.inputs.length = 0;
      },

      (error) => {
        console.error(error);
        Swal.fire('Failed to add question', '', 'error');
      }
    );
}

  getallcodingquestions(id?: number) {
    this.http
      .get(`http://localhost:9033/api/subject/${id}/codingquestions`)
      .subscribe((data) => {
        this.getCodingQuestion = this.getCodingQuestion.concat(data);
        this.addTestCases();
      });
  }

 addTestCases() {

  if (!this.codingQuestionId) {
    console.error('Coding Question ID is undefined');
    return;
  }

  this.inputs.forEach((data) => {

    const testCase = new TestCases();

    testCase.input = data.input;
    testCase.expectedOutput = data.output;

    this.http
      .post(
        `http://localhost:9033/api/addtestcases/${this.codingQuestionId}`,
        testCase
      )
      .subscribe(
        (response) => {
          console.log('Test case saved successfully:', response);
        },
        (error) => {
          console.error('Error saving test case:', error);
        }
      );
  });
}




    // Function to handle the clear button action
    clearForm() {
      this.questionForm.reset(); // Reset the form to its initial state
    }

  goBack() {
    this.loadAddCodingQuestionPage.emit(true);
  }
}
