
import { LoginserviceService } from 'src/app/components/loginmodal/loginservice.service';

import { useranswer } from './../../../../../model/model/useranswer';

import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef,  HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Question } from 'src/app/model/model/Question';
import { ScheduleExam } from 'src/app/model/model/ScheduleExam';
import { Subject } from 'src/app/model/model/Subject';

import { MyserviceService } from 'src/app/model/myservice';
import Swal, { SweetAlertResult } from 'sweetalert2';

import moment from 'moment';
import { UserExamDetails } from 'src/app/model/model/UserExamDetails';

import { FullScreenServiceService } from 'src/app/services/full-screen-service.service';



@Component({
  selector: 'app-userexam',
  templateUrl: './userexam.component.html',
  styleUrls: ['./userexam.component.css'],
})

export class UserexamComponent {
  public isRadioButtonSelected = false;
  activeIndex: number = -1;
  code?: any;
  currentQuestion?: Question;
  subjectId?: number;
  uid: any;
  eid: any;
  // questions: any[] =[]
  subjects: Subject[] = [];
  selectedOptions =new Map();
  answer:useranswer=new useranswer() ;
  uniqueSubjectNames: string[] = [];         /**This is the new line added the old one is commented below */
  // uniqueSubjectNames: String[] =[];
  selected:boolean=false;
  stateChange:any[]=[];
  questionnumber:number=0;
  clickedSubject:string="";           /**This is the new line added the old one is commented below */
  // clickedSubject:String="";
  selectedOption: string = '';
  examminutes?:number;
  remainingTime: number=0
  timerId: any;
  TotalQuestion:Question[]=[];
  showbuttons?:boolean=false;
  codingquestionid?:number;
  examtime?:ScheduleExam=new ScheduleExam();
  totalQuestions:number=0;
  remainingQuestion:number=0;
  timeexpire?:boolean=false;
  cId?:number;
  id?:number;
  codeId?:String;
  minutes1?:number=0
  examtime1?:number
  answerMap=new Map();
  answerArray:any[]=[];
  isCheckedA:boolean=false;
  isCheckedB:boolean=false;
  isCheckedC:boolean=false;
  isCheckedD:boolean=false;
  isChecked:boolean=false;
  checkboxoption?:string[]=[];
  checkboxState: { [key: number]: string[] } = {};

  examdetails: UserExamDetails=new UserExamDetails();
  activeSubject: string | undefined;
  questions: any[] = [];
  once: boolean = true;
  examSubmitted: boolean = false;   /**This line is added newly 05.09.2026*/
  subjectName: string ='';          /**This line is added newly the old one is commented below */
// subjectName: String ='';

    // =====================================================
// CODING QUESTION STATE
// Keeps coding answer when user moves to another question
// =====================================================

codingAnswers: {
  [questionId: number]: {
    code: string;                                       /**this line of code added newly 88-103 */
    language: string;
    submitted: boolean;
    executionStatus: string;
    passedTestCases: number;
    totalTestCases: number;
    passedPercentage: number;
    codeOutput: string;
    showResult: boolean;
  }
} = {};
codingCodeMap = new Map<number, string>();
codingLanguageMap = new Map<number, string>();
codingStatusMap = new Map<number, string>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private service: MyserviceService,
    private router: Router,
    private locationStrategy: LocationStrategy,
    private fullscreenService : FullScreenServiceService,
    private elementRef : ElementRef,
    private loginService : LoginserviceService
  ) {}



  ngOnInit(): void {
    this.enableFullscreen()
    this.service.runCodeClicked.subscribe((data)=>{this.cId=data

      if(this.cId!=undefined){
        this.codeId = 'C' + this.cId
        if(!this.stateChange.includes(this.codeId)){
          this.stateChange.push(this.codeId);
           console.log('Coding question attempted:', this.codeId);
           console.log('State Change:', this.stateChange);
        }}
      })

    this.locationStrategy.onPopState(() => {
      history.forward();
    });
    this.uid = this.service.sendid();
    this.eid = this.service.sendeid();
    this.startTimer()
    // this.fetchExamTime().then(()=>{
    //   this.afterFetchExamTime();
    // })

    let method1Completed = false; // Synchronization variable

    const handleMethod1Completion = () => {
      if (method1Completed) {
        this.afterFetchExamTime(); // Execute method 2 only if method 1 has completed
      } else {
        method1Completed = true; // Update the synchronization variable
      }
    };

    this.fetchExamTime()
      .then(handleMethod1Completion)
      .catch(error => {
        // Handle errors from method1 if needed
      });

    handleMethod1Completion(); // Check if method1 has already completed

    this.route.params.subscribe((params) => {
      this.code = params['code'];
      this.http.get<any>(`http://localhost:9033/api/getquestionsBySubjectId/${this.code}`).subscribe(data=>{this.questions=data,    /**Here changed to localhost:9033  -24.08.2026 */
        this.totalQuestions=data.length;
        this.nextquestions(0,this.questions[0].optionA,this.questions[0].id);
    });
      this.loadSubjects().subscribe((subjects: Subject[]) => {
        this.subjects = subjects;
        this.uniqueSubjectNames = this.getUniqueSubjectNames(this.subjects);
        console.log(subjects);
      });
    });

     // Get the root element
     this.openFullscreen();
     document.addEventListener(
       'fullscreenchange',
       this.onFullscreenChange.bind(this)
     );
  }



  openFullscreen() {
    const ele = this.elementRef.nativeElement;
    console.log(ele);
    ele.requestFullscreen();
    if (ele.requestFullscreen) {
      console.log(ele.requestFullscreen);
      // ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
      /* Firefox */
      ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      ele.webkitRequestFullscreen();
    } else if (ele.msRequestFullscreen) {
      /* IE/Edge */
      ele.msRequestFullscreen();
    }
  }

  onFullscreenChange(event: Event) {
    console.log('onFullscreenChange excecut');

    if (document.fullscreenElement === null) {
      // event.preventDefault()
      this.showConfirmationDialog();
    }
  }

  showConfirmationDialog() {

    // Do nothing if the exam has already been submitted
  // if (this.examSubmitted) {
  //   console.log('Exam already submitted. Ignoring fullscreen exit.');
  //   return;
  // }
    if (this.once) {
      Swal.fire({
        title: 'If you try to exit again the exam will be auto submited ! click submit to submit the exam',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',

      }).then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          console.log('Confirmed');

           // IMPORTANT: Mark as submitted before navigation
        // this.examSubmitted = true;

          this.router.navigate(['answers', this.code]);
        this.http.put<UserExamDetails>(`http://localhost:9033/api/userExamDetailssubmit/${this.eid}/${this.uid}`,this.examdetails).subscribe((response=>{    /**Here changed to localhost:9033  -24.08.2026 */
        console.log("submitted"+response)
      }))
          // this.exitFullScreen();
        } else {
          this.once = !this.once;
          console.log('Cancelled');
          this.openFullscreen();
          // Handle the cancellation if needed
        }
      });
    } else {
      console.log('2nd time auto submit');

      // IMPORTANT: Mark as submitted before navigation
    // this.examSubmitted = true;

      this.router.navigate(['answers', this.code]);
        this.http.put<UserExamDetails>(`http://localhost:9033/api/userExamDetailssubmit/${this.eid}/${this.uid}`,this.examdetails).subscribe((response=>{       /**Here changed to localhost:9033  -24.08.2026 */
        console.log("submitted"+response)
      }))

      // this.exitFullScreen();
    }
  }



  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    localStorage.removeItem('is_logged_in');
    localStorage.clear();
    this.loginService.isLoggedIn = false

  }
  enableFullscreen() {
    this.fullscreenService.enableFullscreen();
  }
  async fetchExamTime(){

    this.http.get<UserExamDetails>(`http://localhost:9033/api/ExamDetails/${this.eid}/${this.uid}`).subscribe(async (response)=>{         /**Here changed to localhost:9033  -24.08.2026 */
      if (response && response.loginTime && response.logoutTime){
      const loginTime: moment.Moment = moment(response.loginTime, 'HH:mm:ss'); // Replace with your actual login time
      const logoutTime: moment.Moment = moment(response.logoutTime, 'HH:mm:ss'); // Replace with your actual logout time

      const duration: moment.Duration = moment.duration(logoutTime.diff(loginTime));
      this.minutes1 =Math.round(duration.asMinutes());
      console.warn(this.minutes1+"minus minutes in response")
      await this.asyncOperation()

      }
    })}

    afterFetchExamTime(){
      this.http.get(`http://localhost:9033/api/getquestions/${this.eid}`).subscribe(data=>{this.examtime=data                                   /**Here changed to localhost:9033  -24.08.2026 */
      console.warn("into the object"+this.minutes1)
      if(this.minutes1 != 0){
        console.warn(this.minutes1+"minus minutes")
      this.examtime1 = this.examtime.examDuration!-this.minutes1!
        console.warn(this.examtime1+"  examtime when restarted")
      if(this.examtime1 <= 0){
        this.router.navigate(['answers', this.code]);
        this.http.put<UserExamDetails>(`http://localhost:9033/api/userExamDetailssubmit/${this.eid}/${this.uid}`,this.examdetails).subscribe((response=>{   /**Here changed to localhost:9033  -24.08.2026 */
            console.log("submitted"+response)
            Swal.fire('You already attempted exam or exam duration is completed', '', 'error');
            }))
        }
        else{
          this.remainingTime=60*this.examtime1;
          this.remainingTime
        }
      }
      else{
        this.examtime1 = this.examtime.examDuration
        console.warn(this.examtime1+"  examtime when started ")
      if(this.examtime1){
        this.remainingTime=60*this.examtime1;
        }
      }
      });}

      async asyncOperation() {
        // Simulating an asynchronous operation
        return new Promise<void>(resolve => {
          setTimeout(() => {
            resolve();
          }, 3000);
        });
      }





// Initialize the timer properties
minutes = this.remainingTime;
seconds = 0;
showTimer = true;
timerExpired = false;

// Start the timer
startTimer() {
  const timer = setInterval(() => {
    // Decrement the time remaining
    if(this.remainingTime){
    this.remainingTime--;
    this.minutes = Math.floor(this.remainingTime / 60);
    this.seconds = this.remainingTime % 60;

    // Check if the timer has expired
    if (this.remainingTime === 0 && !this.timeexpire ) {
      this.clickEvent2();
      this.timerExpired = true;
      clearInterval(timer);
    }}
  }, 1000);
  this.showTimer = false;
}

  // getUniqueSubjectNames(subjects: Subject[]): String[] {
  //   const uniquesubjects = subjects
  //     .map((subjects) => subjects.name)
  //     .filter((name) => name !== undefined) as String[];
  //   return [...new Set(uniquesubjects)];
  // }

  // The below method was completly new and the old method was commented above
  getUniqueSubjectNames(subjects: Subject[]): string[] {
  const uniqueSubjects = subjects
    .map((subject) => subject.name)
    .filter((name): name is string => name !== undefined);

  return [...new Set(uniqueSubjects)];
}

  loadSubjects(): Observable<Subject[]> {
    return this.http.post<Subject[]>(
      `http://localhost:9033/api/getsubjectsBycode/${this.code}`,               /**Here changed to localhost:9033  -24.08.2026 */
      this.code
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
    document.removeEventListener(
      'fullscreenchange',
      this.onFullscreenChange.bind(this)
    );
  }


  // getQuestionsBySubjectName(subjectName:String):void{
  //   this.questions=[];
  //   this.subjects.forEach((subject)=>{
  //                 if(subject.name==subjectName){
  //                   this.loadQuestions(subject.id).subscribe((data)=>{this.questions=this.questions.concat(data)
  //                   this.questionnumber=0;
  //                   this.nextquestions(0,this.questions[0].optionA,this.questions[0].id);
  //                 })
  //                 }})
  // }

// This was the new method added because the coding question was not displaying -24.08.2026
getQuestionsBySubjectName(subjectName: string): void {

  console.log('Selected Subject:', subjectName);

  this.clickedSubject = subjectName;
  this.questions = [];
  this.questionnumber = 0;
  this.currentQuestion = undefined;
  this.codingquestionid = undefined;

  const selectedSubject = this.subjects.find(
    subject =>
      subject.name?.toLowerCase().trim() ===
      subjectName.toLowerCase().trim()
  );

  if (!selectedSubject) {
    console.error('Subject not found:', subjectName);
    return;
  }

  // =====================================================
  // CODING QUESTIONS
  // =====================================================

  if (selectedSubject.name?.toLowerCase().trim() === 'coding') {

    console.log('CODING SUBJECT ID:', selectedSubject.id);

    this.http
      .get<any[]>(
        `http://localhost:9033/api/getquestionsBySubjectId/${selectedSubject.id}/${this.code}`
      )
      .subscribe({

        next: (data) => {

  console.log('ALL CODING QUESTIONS FROM API:', data);

  // ONLY ACTIVE CODING QUESTIONS
  const activeCodingQuestions = data.filter(
    question =>
      question.status?.toLowerCase().trim() === 'active'
  );

  console.log(
    'ACTIVE CODING QUESTIONS:',
    activeCodingQuestions
  );

  this.questions = activeCodingQuestions;
  this.totalQuestions = this.questions.length;
  this.questionnumber = 0;

  if (this.questions.length > 0) {

    this.currentQuestion = this.questions[0];

    this.codingquestionid =
      this.currentQuestion?.id;

    this.showbuttons = true;

    console.log(
      'Current Coding Question:',
      this.currentQuestion
    );

    console.log(
      'Coding Question ID:',
      this.codingquestionid
    );

  } else {

    this.currentQuestion = undefined;
    this.codingquestionid = undefined;
    this.showbuttons = false;

    console.warn(
      'No ACTIVE coding questions available.'
    );
  }
},

        error: (error) => {

          console.error(
            'Error loading coding questions:',
            error
          );

        }

      });

    return;
  }

  // =====================================================
  // NORMAL QUESTIONS
  // =====================================================

  this.loadQuestions(selectedSubject.id).subscribe({

    next: (data: any) => {

      console.log('NORMAL QUESTIONS:', data);

      this.questions = data;

      this.totalQuestions = data.length;

      this.questionnumber = 0;

      if (this.questions.length > 0) {

        this.nextquestions(
          0,
          this.questions[0].optionA,
          this.questions[0].id
        );

      }

    },

    error: (error) => {

      console.error(
        'Error loading normal questions:',
        error
      );

    }

  });

}

  loadQuestions(subjectid?: number) {
    console.log("lq"+this.questions.length);
    return this.http.get(
      `http://localhost:9033/api/getquestionsBySubjectId/${subjectid}/${this.code}`                         /**Here changed to localhost:9033  -24.08.2026 */
    );
  }

  showQuestion(questionId: number): void {
    this.questions.forEach((question) => {
      if (question.id == questionId) {
        this.currentQuestion = question;
      }
      console.log("showq"+this.questions.length);
    });
  }



  sendoption(qid:number,option1:string)
  {
    if(option1=='A'){
      this.isCheckedA=true;
    }
    if(option1=='B'){
      this.isCheckedB=true;
    }
    if(option1=='C'){
      this.isCheckedC=true;
    }
    if(option1=='D'){
      this.isCheckedD=true;
    }
    const normalQuestionOptionId = "N" + qid;
    if(!this.stateChange.includes(normalQuestionOptionId)){
      this.stateChange.push(normalQuestionOptionId);
    }
    this.selectedOptions.set(qid,option1);
    console.log("option"+option1);
    this.answer = {
      user: {
        id: this.uid,
      },
      exam: {
        id: this.eid,
      },
      question: {
        id: qid,
      },
      userAnswer: option1,
    };
       this.http.post(`http://localhost:9033/api/saveanswer`,this.answer).subscribe(data=>{                             /**Here changed to localhost:9033  -24.08.2026 */
       console.log("188");
       this.selectedOption=option1;
       console.warn(this.eid +"   n   "+ this.uid)
       this.http.put<UserExamDetails>(`http://localhost:9033/api/userExamDetailsbyid/${this.eid}/${this.uid}`,this.examdetails).subscribe((response=>{          /**Here changed to localhost:9033  -24.08.2026 */

       }))
      });
  }


  sendoption2(qid:number,option2:string){
    //this.checkboxoption=this.checkboxoption?.concat(option2);
    const selectedOptions = this.checkboxState[qid] || [];
    if (selectedOptions.includes(option2)) {
      // Remove the option if it is already selected
      this.checkboxState[qid] = selectedOptions.filter((o) => o !== option2);
    } else {
      // Add the option if it is not already selected
      this.checkboxState[qid] = [...selectedOptions, option2];
    }
  }

  submitoption(qid:any,optionarray?:any){
    const normalQuestionOptionId = "N" + qid;
    if(!this.stateChange.includes(normalQuestionOptionId)){
      this.stateChange.push(normalQuestionOptionId);
    }
    const selectedOptions = this.checkboxState[qid] || [];
    selectedOptions.sort();
    this.answer = {
      user: {
        id: this.uid,
      },
      exam: {
        id: this.eid,
      },
      question: {
        id: qid,
      },
      userAnswer: selectedOptions.join(''),
    };
    this.http.post(`http://localhost:9033/api/saveanswer`, this.answer).subscribe((data) => {                     /**Here changed to localhost:9033  -24.08.2026 */
      //this.selectedOption = selectedOptions;
    });
  }


//   isOptionSelected(questionId: number, option: string): boolean {
//     // console.log("31-34");
//     console.log(this.answerArray,"is oprtion selected");
//    console.log( this.answerArray.filter(e=>e.question_id==questionId),"after filtering ")
//     this.selectedOption=option;
//  return this.answerArray.filter(e=>e.question_id==questionId)[0].user_answer==option;
// }


// This is new code added and the old isOptionSelected() is commented above
isOptionSelected(questionId: number, option: string): boolean {

  const answer = this.answerArray.find(
    e => e.question_id == questionId
  );

  return answer ? answer.user_answer === option : false;
}


isOptionSelected2(qid: number, option: string): boolean {
  // console.log("35");
  const selectedOptions = this.checkboxState[qid] || [];
  return selectedOptions.includes(option);
}

clickEvent(exam: any) {
  var remainingQuestion=(this.totalQuestions-this.stateChange.length);
  console.log("remainingQuestion"+remainingQuestion);
  if(remainingQuestion>0){
    Swal.fire({
      title: "Remaining questions are "+ remainingQuestion + " , Are you sure you want to Submit?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel"

    })
    .then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['answers', this.code]);
        this.http.put<UserExamDetails>(`http://localhost:9033/api/userExamDetailssubmit/${this.eid}/${this.uid}`,this.examdetails).subscribe((response=>{         /**Here changed to localhost:9033  -24.08.2026 */
        console.log("submitted"+response)
      }))

      } else {
      }
       });
  }else{
    Swal.fire({
      title: "Are you sure you want to Submit? ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel"
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['answers', this.code]);
        this.http.put<UserExamDetails>(`http://localhost:9033/api/userExamDetailssubmit/${this.eid}/${this.uid}`,this.examdetails).subscribe((response=>{         /**Here changed to localhost:9033  -24.08.2026 */
        console.log("submitted"+response)
      }))
      } else {
      }
       });
  }
  this.timeexpire=true;
}

clickEvent2(){
  // this.examSubmitted = true;          /**This line of code added newly, cuz to disable the 'submit exam swal appear 2 times when press 'esc' button'  05.09.2026*/
  this.router.navigate(['answers', this.code]);
  this.http.put<UserExamDetails>(`http://localhost:9033/api/userExamDetailssubmit/${this.eid}/${this.uid}`,this.examdetails).subscribe((response=>{                   /**Here changed to localhost:9033  -24.08.2026 */
      console.log("submitted"+response)
      }))
      this.timeexpire=true;
}


nextquestion(){
  this.isCheckedA=false;
  this.isCheckedB=false;
  this.isCheckedC=false;
  this.isCheckedD=false;
  // this.isChecked=false;
  console.log("39");
  this.questionnumber++;
  this.currentQuestion= this.questions[this.questionnumber];
  console.log(this.currentQuestion);
  this.http.get<any[]>(`http://localhost:9033/api/byquestionnumber/${this.uid}/${this.eid}`).subscribe((data) => {                      /**Here changed to localhost:9033  -24.08.2026 */

    console.log("30");
    console.log(data);
    this.answerArray=data;
    if(this.answerArray.filter(q=> q.question_id==this.currentQuestion?.id).length!=0)
    {
      // alert("Something")
      console.log("ok option is getting");
      let qMap=this.answerArray.filter(q=> q.question_id==this.currentQuestion?.id)[0]
      console.log(qMap)
      // alert(qMap.user_answer);
      if(qMap.user_answer=='A')
      {
        this.isCheckedA=true;
        console.log("qmapA")
      }
      else if(qMap.user_answer=='B')
      {
        this.isCheckedB=true;
        console.log("qMapB");
      }
      else if(qMap.user_answer=='C')
      {
        this.isCheckedC=true;
        console.log("qMapC");
      }
      else if(qMap.user_answer=='D')
      {
        this.isCheckedD=true;
        console.log("qMapD");
      }
    }
    else
    {
      // this.isChecked=true;
      this.isCheckedA=false;
      // alert("Nothing1"+this.isCheckedA)
      this.isCheckedB=false;
      this.isCheckedC=false;
      this.isCheckedD=false;

    }
  });

}

  //     nextquestions(id:any,option?:any,qid?:any){
  //       this.isCheckedA=false;
  //       this.isCheckedB=false;
  //       this.isCheckedC=false;
  //       this.isCheckedD=false;
  //       // this.isChecked=false;
  //       if(option==undefined)
  //       {
  //         this.codingquestionid=qid
  //       }
  //       this.showbuttons=true;
  //       this.questionnumber= id;
  //       this.currentQuestion= this.questions[id];
  //        // The below lines added newly 691-693
  //         // IMPORTANT FOR CODING QUESTIONS
  // if (this.currentQuestion?.subject?.name?.toLowerCase().trim() === 'coding')
  //    {this.codingquestionid =this.currentQuestion.id;}
  // else {
  //   this.codingquestionid = undefined;
  //   }
  //       id++;


  //       this.http.get<any[]>(`http://localhost:9033/api/byquestionnumber/${this.uid}/${this.eid}`).subscribe((data) => {                  /**Here changed to localhost:9033  -24.08.2026 */
  //         this.answerArray=data;
  //         if(data.length>0){
  //           // alert(data.length);
  //           this.answerArray.map(
  //             q =>{
  //               const normalQuestionOptionId = "N" + q.question_id;
  //               if(!this.stateChange.includes(normalQuestionOptionId)){
  //               this.stateChange.push(normalQuestionOptionId);
  //             }
  //           }

  //           )
  //         }
  //         if(this.answerArray.filter(q=> q.question_id==this.currentQuestion?.id).length!=0)
  //         {
  //           let qMap=this.answerArray.filter(q=> q.question_id==this.currentQuestion?.id)[0]
  //           if(qMap.user_answer=='A')
  //           {
  //             this.isCheckedA=true;
  //           }
  //           else if(qMap.user_answer=='B')
  //           {
  //             this.isCheckedB=true;
  //           }
  //           else if(qMap.user_answer=='C')
  //           {
  //             this.isCheckedC=true;
  //           }
  //           else if(qMap.user_answer=='D')
  //           {
  //             this.isCheckedD=true;
  //           }
  //         }
  //         else
  //         {
  //           // this.isChecked=true;
  //           this.isCheckedA=false;
  //           this.isCheckedB=false;
  //           this.isCheckedC=false;
  //           this.isCheckedD=false;
  //         }
  //       });

  //     }

    // The below nextquestions() was added newly  -27.08.2026
  nextquestions(
  id: any,
  option?: any,
  qid?: any
) {
  this.isCheckedA = false;
  this.isCheckedB = false;
  this.isCheckedC = false;
  this.isCheckedD = false;

  console.log('Opening question:', id);

  this.questionnumber = id;

  this.currentQuestion =
    this.questions[id];

  if (!this.currentQuestion) {
    console.error('Question not found at index:',id);
    return;
  }

  // =====================================================
  // CODING QUESTION
  // =====================================================

  if (this.currentQuestion?.subject?.name?.toLowerCase().trim() === 'coding')
    {
      this.codingquestionid =this.currentQuestion?.id;
    console.log('Coding Question ID:',this.codingquestionid);
      }

  // =====================================================
  // NORMAL QUESTION
  // =====================================================

  else {
       this.codingquestionid =undefined;
      }

  this.showbuttons = true;

  // =====================================================
  // LOAD NORMAL ANSWERS
  // =====================================================

  this.http
    .get<any[]>(
      `http://localhost:9033/api/byquestionnumber/${this.uid}/${this.eid}`
    ).subscribe((data) => {

      console.log( 'Saved normal answers:',data);

      this.answerArray = data;

      // -----------------------------------------------
      // Update attempted state for normal questions
      // -----------------------------------------------

      data.forEach(q => {
        const normalQuestionOptionId ='N' + q.question_id;

        if (!this.stateChange.includes(normalQuestionOptionId))
           {
          this.stateChange.push(normalQuestionOptionId);
        }
      });

      // -----------------------------------------------
      // Restore normal radio answer
      // -----------------------------------------------

      const currentAnswer =
        data.find(
          q =>
            q.question_id ===
            this.currentQuestion?.id
        );

      if (currentAnswer) {

        if (currentAnswer.user_answer === 'A') {
          this.isCheckedA = true;
        }

        else if (currentAnswer.user_answer === 'B') {
          this.isCheckedB = true;
        }

        else if (currentAnswer.user_answer === 'C') {
          this.isCheckedC = true;
        }

        else if (currentAnswer.user_answer === 'D') {
          this.isCheckedD = true;
        }

      }

    });

}

previousquestion(id: any) {

  this.isCheckedA = false;
  this.isCheckedB = false;
  this.isCheckedC = false;
  this.isCheckedD = false;

  id--;

  if (id < 0) {
    return;
  }

  this.questionnumber = id;

  this.currentQuestion =
    this.questions[id];

  if (!this.currentQuestion) {
    return;
  }

  // =====================================================
  // CODING QUESTION
  // =====================================================

  if (
    this.currentQuestion.subject?.name
      ?.toLowerCase()
      .trim() === 'coding'
  ) {

    this.codingquestionid =
      this.currentQuestion.id;

  }

  // =====================================================
  // NORMAL QUESTION
  // =====================================================

  else {

    this.codingquestionid =
      undefined;

  }

  this.http
    .get<any[]>(
      `http://localhost:9033/api/byquestionnumber/${this.uid}/${this.eid}`
    )
    .subscribe((data) => {

      this.answerArray = data;

      const currentAnswer =
        data.find(
          q =>
            q.question_id ===
            this.currentQuestion?.id
        );

      if (!currentAnswer) {
        return;
      }

      if (currentAnswer.user_answer === 'A') {
        this.isCheckedA = true;
      }

      else if (currentAnswer.user_answer === 'B') {
        this.isCheckedB = true;
      }

      else if (currentAnswer.user_answer === 'C') {
        this.isCheckedC = true;
      }

      else if (currentAnswer.user_answer === 'D') {
        this.isCheckedD = true;
      }

    });

}

// The above previousquestion() method was added newly, the old one is commented below   -27.08.2026
      // previousquestion(id:any)
      // {

      //   this.isCheckedA=false;
      //   this.isCheckedB=false;
      //   this.isCheckedC=false;
      //   this.isCheckedD=false;
      //   // this.isChecked=false;
      //   console.log("46");
      //   id--;
      //   this.currentQuestion= this.questions[id];
      //   this.questionnumber--;
      //   this.http.get<any[]>(`http://localhost:9033/api/byquestionnumber/${this.uid}/${this.eid}`).subscribe((data) => {              /**Here changed to localhost:9033  -24.08.2026 */
      //     this.answerArray=data;
      //     if(this.answerArray.filter(q=> q.question_id==this.currentQuestion?.id).length!=0)
      //     {
      //       let qMap=this.answerArray.filter(q=> q.question_id==this.currentQuestion?.id)[0]
      //       if(qMap.user_answer=='A')
      //       {
      //         this.isCheckedA=true;
      //       }
      //       else if(qMap.user_answer=='B')
      //       {
      //         this.isCheckedB=true;
      //       }
      //       else if(qMap.user_answer=='C')
      //       {
      //         this.isCheckedC=true;
      //       }
      //       else if(qMap.user_answer=='D')
      //       {
      //         this.isCheckedD=true;
      //       }
      //     }
      //     else
      //     {
      //       // this.isChecked=true;
      //       this.isCheckedA=false;
      //       this.isCheckedB=false;
      //       this.isCheckedC=false;
      //       this.isCheckedD=false;
      //     }
      //   });

      // }


 stateChangeCheck(qid: number, subject: Subject) {

  if (subject.name?.toLowerCase().trim() === 'coding') {

    // Coding question becomes green ONLY after successful submission
    if (
      this.codingAnswers[qid] &&
      this.codingAnswers[qid].submitted === true
    ) {
      return true;
    }

    // Keep compatibility with existing coding state
    const codingQuestionId = 'C' + qid;

    return this.stateChange.includes(codingQuestionId);

  } else {

    const normalQuestionId = 'N' + qid;

    return this.stateChange.includes(normalQuestionId);
  }
}

      /**The above stateChangeCheck() was added newly to change the color of the question number when answered , the old one is commented below   -29.08.2026 */
// stateChangeCheck(qid:number, subject : Subject)
// {
// //   console.log(this.stateChange)
//   if(subject.name == 'CODING'){
//     const codingQuestionId = 'C' + qid
//     return this.stateChange.includes(codingQuestionId);
//   }else{
//     const normalQuestionId = 'N'+qid
//     return this.stateChange.includes(normalQuestionId);
//   }
// }


// setActive(index: number, subjectName:String) {
//   console.log(subjectName)
//   this.clickedSubject = subjectName;
//   this.activeIndex = index;
//   this.nextquestions(this.activeIndex)
// }

// This setActive() was added newly and old method is commented above  -25.08.2026
setActive(index: number, subjectName: string) {
  console.log("Active Subject:", subjectName);

  this.clickedSubject = subjectName;
  this.activeIndex = index;
}

//disable right click
disableRightClick(event: MouseEvent): void {
  event.preventDefault();

}


// The below methods saveCodingState(),getCodingState(),getSavedCodingCode(),saveCodingCode() are added newly to filter and get only the active coding questions
saveCodingState(state: any): void {

  if (state == null || state.questionId == null) {
    return;
  }

  const questionId = Number(state.questionId);

  this.codingAnswers[questionId] = {
    code: state.code ?? '',
    language: state.language ?? '',
    submitted: state.submitted ?? false,
    executionStatus: state.executionStatus ?? '',
    passedTestCases: state.passedTestCases ?? 0,
    totalTestCases: state.totalTestCases ?? 0,
    passedPercentage: state.passedPercentage ?? 0,
    codeOutput: state.codeOutput ?? '',
    showResult: state.showResult ?? false
  };

  console.log(
    'Saved coding state:',
    questionId,
    this.codingAnswers[questionId]
  );
}
getCodingState(questionId: number): any {

  return this.codingAnswers[questionId] || null;
    // code: '',
    // language: '',
    // submitted: false,
    // executionStatus: '',
    // passedTestCases: 0,
    // totalTestCases: 0,
    // passedPercentage: 0,
    // codeOutput: '',
    // showResult: false

}

// getSavedCodingCode(questionId?: number): string {

//   if (questionId == null) {
//     return '';
//   }

//   return this.codingCodeMap.get(questionId) || '';
// }

// saveCodingCode(event: {
//   questionId: number;
//   code: string;
//   language: string;
// }): void {

//   this.codingCodeMap.set(event.questionId, event.code);
//   this.codingLanguageMap.set(event.questionId, event.language);

//   console.log(
//     'Saved coding code:',
//     event.questionId,
//     event.code
//   );
// }

}
