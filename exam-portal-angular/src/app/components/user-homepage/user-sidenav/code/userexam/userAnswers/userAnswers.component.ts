
import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Marks } from 'src/app/model/model/Marks';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Question } from 'src/app/model/model/Question';
import { ScheduleExam } from 'src/app/model/model/ScheduleExam';
import { useranswer } from 'src/app/model/model/useranswer';
import { MyserviceService } from 'src/app/model/myservice';
import { LoginserviceService } from 'src/app/components/loginmodal/loginservice.service';
// The below import was a new, it was added because to display the coding question
import { UserCode } from 'src/app/model/model/UserCode';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-userAnswers',
  templateUrl: './userAnswers.component.html',
  styleUrls: ['./userAnswers.component.css']
})
export class UserAnswersComponent implements OnInit {


  code?: any;
  uid:any;
  eid:any;
  questions:Question[]=[];
  score?:number;
  userAnswers: useranswer[]=[];
  // The below line is new - line 37
  userCodes: UserCode[] = [];
  totalmarks?:number;
  obtainedMarks?:Marks;
  exam?:ScheduleExam;
  codeFlag?:boolean;
  marksInserted: boolean = false;

  constructor(private router : Router, private http: HttpClient,private route:ActivatedRoute,private service:MyserviceService,
    private locationStrategy: LocationStrategy, private loginService : LoginserviceService
    ) { }

ngOnInit() {
  this.locationStrategy.onPopState(() => {
    history.forward();
  });

  this.uid = this.service.sendid();
  this.eid = this.service.sendeid();

  console.log("enter...", this.uid, this.eid);

  this.route.params.subscribe(params => {

    this.code = params['code'];

    console.log('Exam code:', this.code);

    // Load questions
    this.loadQuestions().subscribe(data => {
      this.questions = data;
    });

    // Load normal MCQ user answers for answer sheet/PDF
    this.loadUserAnswers().subscribe(data => {
  this.userAnswers = data;
    });

    // Load normal score
    this.loadScore().subscribe(data => {

      this.score = data;

      console.log("Normal question score:", this.score);

      this.calculateFinalScore();

    });

    // Load coding answers
    this.loadUserCodes().subscribe(data => {

      console.log("CODING CODES:", data);

      this.userCodes = data;

      this.calculateFinalScore();

    });

    // Load exam
    this.loadExam().subscribe(data => {

      this.exam = data;

      console.log("EXAM:", this.exam);

      this.calculateFinalScore();

    });

  });

  this.loginService.isResultPage = true;
}

// The above ngOnInit() method was added newly because to calculate the user answers properly , the old one is commented below  -29.08.2026
//   ngOnInit() {
//     this.locationStrategy.onPopState(() => {
//       history.forward();
//     });

//     // Get logged-in user ID and exam ID
//     this.uid=this.service.sendid();
//     this.eid=this.service.sendeid();
//     console.log("enter..."+this.uid,this.eid)

//     // Get exam code from URL
//     this.route.params.subscribe(params => {
//       this.code = params['code'];
//       console.log('Exam code:', this.code);

//       // Load questions
//       this.loadQuestions().subscribe(data=>{
//                              this.questions=data;})
//                       })

//                       // Load normal-question score
//   this.loadScore().subscribe((data)=>{this.score=data;
//                                       this.score=this.score+this.service.getcodingmarks();
//                                       console.log("in answers"+this.score);
//                                       if (!this.marksInserted) { // Insert marks only if they haven't been inserted before
//                                         this.insertMarks();
//                                         this.marksInserted = true; // Set the flag to true after inserting marks
//                                       }
//                                     })

//     // Load normal user answers

//   // this.loadUserAnswers().subscribe((data)=>this.userAnswers=data)
//   // The below line of code is added newly to display the coding question line 74-77

//   this.loadUserCodes().subscribe((data) => {
//   console.log("CODING CODES:", data);
//   this.userCodes = data;
// });

//   this.loadExam().subscribe(data=>{
//     this.exam=data
//   })
//   this.loginService.isResultPage = true
// }

  loadQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`http://localhost:9033/api/getquestionsBySubjectId/${this.code}`);       /**Here http://54.64.6.102:9033/api/getquestionsBySubjectId/${this.code}  changed to localhost:9033   -24.08.2026 */
  }



  loadScore(): Observable<number>{
    return this.http.get<number>(`http://localhost:9034/api/getScore/${this.uid}/${this.eid}`);                     /**Here http://54.64.6.102:9034/api/getScore/${this.uid}/${this.eid}  changed to localhost:9033   -24.08.2026 */
  }

  loadUserAnswers(): Observable<useranswer[]>{
    return this.http.get<useranswer[]>(`http://localhost:9033/api/getUserAnswers/${this.uid}/${this.eid}`);               /**Here http://54.64.6.102:9033/api/getUserAnswers/${this.uid}/${this.eid}  changed to localhost:9033   -24.08.2026 */
  }

  loadExam():Observable<ScheduleExam>{
    return this.http.get<ScheduleExam>(`http://localhost:9033/api/getexam/${this.eid}`)                                     /**Here http://54.64.6.102:9033/api/getexam/${this.eid}  changed to localhost:9033   -24.08.2026 */
  }
  saveScore(){
    this.http.post(`http://localhost:9033/api/savemarks`,this.obtainedMarks).subscribe((data)=>console.log(data+"saved"));          /**Here http://54.64.6.102:9033/api/savemarks  changed to localhost:9033   -24.08.2026 */
  }

  insertMarks(){
    console.log(this.exam)
    this.totalmarks=this.exam?.createPaper?.totalMarks;
    console.log(this.exam?.createPaper?.totalMarks+"+++")
    console.log(this.score)
    this.obtainedMarks={

      user:{
        id:this.uid
      },
      exam:{
        id:this.eid
      },
      totalMarks: this.totalmarks,
      marks:this.score,

    }
    this.saveScore()
  }

  generatePDF() {

  const docDefinition: TDocumentDefinitions = {

    content: [

      {
        text: `Your Score is : ${this.score} / ${this.exam?.createPaper?.totalMarks}`,
        style: 'header'
      },

      {
        ol: this.questions.map((question) => {

          const listItems: any[] = [];

          const questionContent =
            question?.content?.replace(/<[^>]*>/g, '');

          const isCodingQuestion =
            question?.subject?.name?.trim().toUpperCase() === 'CODING';

          // =====================================================
          // CODING QUESTION
          // =====================================================

          if (isCodingQuestion) {

            if (questionContent) {
              listItems.push(
                `Coding Question:\n${questionContent}`
              );
            }

            const codingAnswer = this.userCodes.find(
              code =>
                code?.codingQuestion?.id === question?.id
            );

            if (codingAnswer) {

              listItems.push(
                `Programming Language : ${codingAnswer.language || 'Not specified'}`
              );

              listItems.push(
                `Submitted Code:\n${codingAnswer.userInputCode || 'No code submitted'}`
              );

              if (
                codingAnswer.iscorrect?.trim().toLowerCase() ===
                'correct'
              ) {

                listItems.push(
                  `Result : ✓ Correct`
                );

              } else {

                listItems.push(
                  `Result : ✗ Incorrect`
                );

              }

            } else {

              listItems.push(
                `Programming Language : Not submitted`
              );

              listItems.push(
                `Submitted Code:\nNo code submitted`
              );

              listItems.push(
                `Result : Not answered`
              );

            }

            listItems.push('\n');

          }

          // =====================================================
          // NORMAL MCQ QUESTION
          // =====================================================

          else {

            if (questionContent) {
              listItems.push(questionContent);
            }

            listItems.push(`A) ${question?.optionA}`);
            listItems.push(`B) ${question?.optionB}`);
            listItems.push(`C) ${question?.optionC}`);
            listItems.push(`D) ${question?.optionD}`);

            const answer = this.userAnswers.find(
              answer =>
                answer?.question?.id === question?.id
            );

            if (answer) {

              listItems.push(
                `YourAnswer : ${answer.userAnswer}`
              );

            } else {

              listItems.push(
                `YourAnswer : Not answered`
              );

            }

            listItems.push(
              `CorrectAnswer : ${question?.answer}`
            );

            listItems.push('\n');

          }

          return listItems.map(item => ({
            text: item
          }));

        })
      }

    ],

    styles: {

      header: {
        alignment: 'center',
        fontSize: 20,
        margin: [0, 0, 0, 10]
      }

    }

  };

  pdfMake.createPdf(docDefinition).open();
}

// The above generatePDF() method is added newly because for codingQuestions the answer getting as MCQ's to solve that we added new one, the old one is commented below - 29.08.2026

//   generatePDF() {
//     const docDefinition: TDocumentDefinitions = {
//       content: [
//         {
//           text: `Your Score is : ${this.score} / ${this.exam?.createPaper?.totalMarks}`,
//           style: 'header'
//         },
//         {
//           ol: this.questions.map((question, i) => {
//             const listItems = [];

//             // Use a regular expression to remove HTML tags from the question content
//             const questionContent = question?.content?.replace(/<[^>]*>/g, '');

//             if (questionContent) {
//               listItems.push(questionContent);
//             }

//             // Add the answer options and user answer (if available) to the listItems array
//             if (question?.subject?.name !== 'CODING') {
//               listItems.push(`A) ${question?.optionA}`);
//               listItems.push(`B) ${question?.optionB}`);
//               listItems.push(`C) ${question?.optionC}`);
//               listItems.push(`D) ${question?.optionD}`);

//               const answer = this.userAnswers.find(answer => answer?.question?.id === question?.id);

//               if (answer) {
//                   listItems.push(`YourAnswer : ${answer.userAnswer}`);
//               }

//               listItems.push(`CorrectAnswer : ${question?.answer}`);
//               listItems.push('\n');

//             } else {
//               listItems.push('\n');
//             }

//             // Map each list item string to an ordered list item object with a `text` property
//             return listItems.map(item => ({ text: item }));
//           })
//         }

//       ],
//       styles: {
//         header: {
//           alignment: 'center',
//           fontSize: 20,
//           margin: [0, 0, 0, 10]
//         }
//       }
//     };

//     pdfMake.createPdf(docDefinition).open();
// }

// The below loaduserCodes(), calculateFinalScore() are added newly to calculate the coding marks   -29.08.2026
// This method is completly new , added because to get the coding question to be displayed
loadUserCodes(): Observable<UserCode[]> {
  return this.http.get<UserCode[]>(
    `http://localhost:9033/api/getusercodes/${this.uid}/${this.eid}`
  );
}

calculateFinalScore() {

  // Wait until all required data is available
  if (
    this.score === undefined ||
    this.exam === undefined ||
    this.userCodes.length === 0
  ) {
    return;
  }

  const normalScore = this.score;

  console.log("Normal score:", normalScore);
  console.log("Coding answers:", this.userCodes);

  /*
   * Check whether the coding answer was correct.
   */
  const codingCorrect = this.userCodes.some(
    code => code.iscorrect === 'correct'
  );

  console.log("Coding correct:", codingCorrect);

  /*
   * TEMPORARY:
   * Your CodingComponent currently awards 5 marks.
   *
   * We should NOT assume this is correct for every paper.
   * For your current paper, verify the coding question's
   * actual marks before changing this value.
   */
  const codingMarks = codingCorrect
    ? this.service.getcodingmarks()
    : 0;

  this.score = normalScore + codingMarks;

  console.log("Normal marks:", normalScore);
  console.log("Coding marks:", codingMarks);
  console.log("FINAL SCORE:", this.score);

  if (!this.marksInserted) {

    this.insertMarks();

    this.marksInserted = true;
  }
}

}
