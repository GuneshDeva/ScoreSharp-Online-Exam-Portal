import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { response } from 'express';
import { CreatePaper } from 'src/app/model/model/CreatePaper';
import { ScheduleExam } from 'src/app/model/model/ScheduleExam';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css']
})
export class AddExamComponent implements OnInit{
  @Output('loadAddExampage') loadAddExampage = new EventEmitter();
  constructor(private http :HttpClient) { }
  scheduleExam=new ScheduleExam();
  papers: CreatePaper[] = [];
  paperId?: number;
  selected = null;
  subjectControl = new FormControl();
  exams:ScheduleExam[]=[];
  start?:any;
  end?:any;



  ngOnInit(): void {
    this.http.get<CreatePaper[]>(`http://localhost:9033/api/getpaper`).subscribe(data=>{
       this.papers=data;
    })
   }

   addpaper(paperId?: number) {
  if (paperId !== undefined) {
    this.paperId = paperId;
  }
}



  calculateDuration() {
  if (this.scheduleExam.startTime && this.scheduleExam.endTime) {

    const start = new Date(this.scheduleExam.startTime);
    const end = new Date(this.scheduleExam.endTime);

    const difference = end.getTime() - start.getTime();

    if (difference > 0) {
      this.scheduleExam.examDuration = Math.floor(
        difference / (1000 * 60)
      );
    } else {
      this.scheduleExam.examDuration = undefined;
    }
  }
}

  addexam(scheduleExam: ScheduleExam) {

  // Check all required fields
  if (
    !scheduleExam.name?.trim() ||
    !scheduleExam.code?.trim() ||
    !scheduleExam.startTime ||
    !scheduleExam.endTime ||
    scheduleExam.examDuration === undefined ||
    scheduleExam.examDuration === null ||
    this.paperId === undefined ||
    this.paperId === null
  ) {
    Swal.fire("All fields must be required", "", "error");
    return;
  }

  // Check duration
  if (Number(scheduleExam.examDuration) <= 0) {
    Swal.fire("ExamDuration must be a positive number", "", "error");
    return;
  }

  // Convert date/time
  this.start = new Date(scheduleExam.startTime);
  this.end = new Date(scheduleExam.endTime);

  // Check dates
  if (this.start >= this.end) {
    Swal.fire(
      "Start time must be less than end time",
      "",
      "error"
    );
    return;
  }

  // Send request to backend
  this.http
    .post<ScheduleExam>(
      `http://localhost:9033/api/addexam/${this.paperId}`,
      scheduleExam
    )
    .subscribe(
      response => {
        Swal.fire(
          "Exam scheduled successfully",
          "",
          "success"
        );
        this.goBack();
      },
      error => {

        console.log("Exam scheduling failed");
        console.log("Status:", error.status);
        console.log("Error:", error.error);

        Swal.fire(
          "Failed to schedule exam",
         "Exam code may already exist. Please use a different exam code.",
          "error"
        );
      }
    );
}



  onCheckboxChange(event: MatCheckboxChange): void {
    this.scheduleExam.showResults = event.checked
  }

  goBack() {
      this.loadAddExampage.emit(true);
     }

}



