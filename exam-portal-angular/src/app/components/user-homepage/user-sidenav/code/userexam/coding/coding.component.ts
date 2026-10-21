import { response } from 'express';

// import { Component, Input } from '@angular/core';
// import { Output } from './Output';
import { CodingApiService } from '../coding-api.service';
import { MyserviceService } from 'src/app/model/myservice';
import { UserCode } from 'src/app/model/model/UserCode';
import { HttpClient } from '@angular/common/http';
import { TestCases } from 'src/app/model/model/TestCases';
import Swal from 'sweetalert2';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
@Component({
  selector: 'app-coding',
  templateUrl: './coding.component.html',
  styleUrls: ['./coding.component.css'],
})
export class CodingComponent implements OnChanges {       /** This line is added new old one is "export class CodingComponent"*/

  code: string = '';
  input: string = '';
  examid?: any;
  userCode?: UserCode;
  userid?: any;
  // codeOutput?: Output[];
  codeOutput: string = '';            /**This line of code is added newly, the old one is commented below, it is added because to disable second box after output box */
  executionStatus: string = '';        /**This line of code added newly to show the message of 'wrong Answer' if the test case fails , in the output box   -27.08.2026 */
  passedPercentage: number = 0;         /**This line of code is added newly to show the testcases pass percentage -27.08.2026 */
  showResult: boolean = false;          /**This line of code is added newly to show the syntex message and also result  -27.08.2026 */
@Input() savedState: any = null;        /**This line of code added newly 27.08.2026 */
@Output() codingStateChange =           /**This line of code added newly 27.08.2026 */
  new EventEmitter<any>();
  @Input() savedCode: string = '';        /**This line of code added newly 27.08.2026 */
  @Input() id?: any;
  Testcase?: TestCases[] = [];
  Testcases?: any[] = [];
  selectedLanguage: string = '';
  index = 0;
  codingMarks = 0;
  count: number = 0;
  setId: number = 0;
  flag: boolean = false;
  response?: any[];
  passedTestCases: number = 0;
  runCodeSuccessfull: boolean = false;
  iscorrect:string="wrong";

  // @Input() savedCode: string = '';
  @Output() codeChanged = new EventEmitter<{                /**This line of code added newly 52-56  -27.08.2026 */
  questionId: number;
  code: string;
  language: string;
}>();

  constructor(
    private apiService: CodingApiService,
    private service: MyserviceService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {

    this.examid = this.service.sendeid();
    this.userid = this.service.sendid();
    this.restoreCodingState();
    //  if (this.savedCode) {                    //these lines of code added newly 61-63
    // this.code = this.savedCode;
    // }

     console.log('Coding Question ID:', this.id);
       //  This below lines of code added newly   62-98
      console.log('Exam ID:', this.examid);
      console.log('User ID:', this.userid);
  // =====================================================
  // RESTORE PREVIOUS CODING STATE
  // =====================================================
  if (this.savedState) {
    console.log(
      'Restoring coding state:',
      this.savedState
    );

    this.code =
      this.savedState.code ?? '';

    this.selectedLanguage =
      this.savedState.language ?? '';

    this.executionStatus =
      this.savedState.executionStatus ?? '';

    this.passedTestCases =
      this.savedState.passedTestCases ?? 0;

    this.passedPercentage =
      this.savedState.passedPercentage ?? 0;

    this.codeOutput =
      this.savedState.codeOutput ?? '';

    this.showResult =
      this.savedState.showResult ?? false;

    this.runCodeSuccessfull =
      this.savedState.submitted ?? false;

  }
  }

ngOnChanges(changes: SimpleChanges): void {             /**This Method was added newly -29.08.2026 */

  if (changes['savedState']) {

    if (this.savedState) {

      console.log(
        'Restoring state for Coding Question:',
        this.id
      );

      this.restoreCodingState();

    }
    // else {

    //   this.code = '';
    //   this.selectedLanguage = '';
    //   this.executionStatus = '';
    //   this.passedTestCases = 0;
    //   this.passedPercentage = 0;
    //   this.codeOutput = '';
    //   this.showResult = false;
    //   this.runCodeSuccessfull = false;

    // }
  }

}
  // runCode(code:string)
//   runCode() {
//     // alert('runCode() was called');        /**This line of code added newly   -26.08.2026 */
//       console.log(this.id+"in runcode")
//     console.log("code")
//     console.log(this.code)
//     if(!this.selectedLanguage){
//       Swal.fire("Fill All Fields", "Must be select the any programming language", "error");
//       return;
//     }


//     if (this.code=='') {
//       Swal.fire("Fill All Fields", "Must be write programming code", "error");
//       return;
//     }

//     this.userCode = {
//       language: 'java',
//       userInputCode: this.code,     /**Here userInputCode: code to userInputCode: this.code */
//       exam: {
//         id: this.examid,
//       },
//       user: {
//         id: this.userid,
//       },
//       codingQuestion: {
//         id: this.id,
//       },
//     };
//     this.service.setCId(this.id);
//     this.executionStatus = '';                    /**This line of code added newly for the above variable 'executionStatus: string = '';'  which is added in line 26, it is added because to display 'Wrong Answer' if the test case fails */
//     this.passedPercentage = 0;                    /**This line of code added newly for above variable "passedPercentage: number = 0;" -27.08.2026*/
//     this.showResult = false;                      /**This line of code added newly for above variable "showResult: boolean = false;" -27.08.2026*/
//     this.passedTestCases = 0;
//     this.http
//       .get(`http://localhost:9033/api/getalltestcases/${this.id}`)          /**Here http://54.64.6.102:9033/api/getalltestcases/${this.id} changed to localhost:9033  -24.08.2026*/
//       .subscribe((data) => {
//         this.Testcase?.splice(0, this.Testcase.length);
//         this.Testcase = this.Testcase?.concat(data);

//         this.count = 0;
//         // this.codeOutput = [];                               /**This line of code added newly to disable the second output box next to the output box  -27.08.2026 */
//         this.Testcase?.forEach((a) => {
//           console.log(a.input + 'above');

//           this.apiService
//             .runCode(this.code, this.selectedLanguage, a.input)
//             .subscribe(
//               (response) => {
//                  console.log('CODE RESPONSE:', response);                   /**This line is added newly   -27.08.2026 */
//                  console.log('OUTPUT:', response.stdout);                                  /**This line is added newly   -27.08.2026 */
//                  console.log('EXPECTED OUTPUT:', a.expectedOutput);                        /**This line is added newly   -27.08.2026 */
//                 console.log(response);
//                 console.log(response.output);
//                 console.log(a.expectedOutput);
//                 this.codeOutput = response.stdout ?? '';         /**This line is added newly   -27.08.2026 */
//                 // if (response.output.trim() === a.expectedOutput)
//                if (response.stdout.trim() === (a.expectedOutput ?? '').trim())       /**The if was added newly, old one is commented above -27.08.2026*/
//                   {
//                   this.count++;
//                   console.log(this.count);
//                   console.log('Your program is correct.');
//                   console.log('F -' + this.count);
//                   console.log('F -' + this.passedTestCases);
//                   // this.passedTestCases = this.count;
//                   this.passedTestCases = this.count;
//               // The below if blocks are added newly, to show the testcases pass/fails and also the percentage of them (line 123-131), the old if is commented below(line 132-135)  -27.08.2026
//                 if (this.Testcase && this.Testcase.length > 0) {
//                                    this.passedPercentage =
//                                   (this.passedTestCases / this.Testcase.length) * 100;
//                                   }

//                 if (this.passedTestCases == this.Testcase?.length) {
//                                    this.iscorrect = "correct";
//                                    this.executionStatus = 'Accepted';
//                                   }
//                   // if (this.passedTestCases == this.Testcase?.length) {
//                   //   this.iscorrect = "correct";
//                   //   this.executionStatus = 'Accepted';                    /**This line of code added newly, to show status of output -27.08.2026*/
//                   // }
//                 }

//                 // else {
//                 //   this.flag = false;
//                 //   this.executionStatus = 'Accepted';                  /**This line of code added newly, to show status of output -27.08.2026*/
//                 //   console.log('your program is incorrect');
//                 // }

// // This else method is added completly new to verify the wrong test cases and show the percentage of no. test cases passed  (line 145-155), the old one is commented below  -27.08.2026
//                 else {
//                      this.flag = false;
//                      this.executionStatus = 'Wrong Answer';

//                       if (this.Testcase && this.Testcase.length > 0) {
//                                       this.passedPercentage =
//                                       (this.passedTestCases / this.Testcase.length) * 100;
//                           }

//                              console.log('Your program is incorrect');
//                          }


//                 this.sendingBoolean();

//                 //  this.response=this.response?.concat(response);
//                 // console.log(this.response)
//                 //this.codeOutput = this.codeOutput?.concat(response);
//                 this.runCodeSuccessfull = true;
//                 this.showResult = true;                           /**This line of code is added newly to get the result of output  -27.08.2026 */
//               },
//               (error) => {

//   console.error('CODE API ERROR:', error);

//   alert(
//     'API ERROR\n' +
//     'Status: ' + error.status + '\n' +
//     'Message: ' + (error.message || 'Unknown error') + '\n' +
//     'Error: ' + JSON.stringify(error.error)
//   );

// }
//               // (error) => {
//               //   console.log(error);
//               //   this.codeOutput = [error];      /**This line added [] before it is  this.codeOutput = error;  -26.08.2026*/
//               // }
//             );
//         });
//       });
//   }



// This runCode() added newly, the old one is commented above (the old code from line 57-188)
runCode() {

  console.log(this.id + " in runcode");
  console.log("code:", this.code);

  // ================= VALIDATION =================

  if (!this.selectedLanguage) {
    Swal.fire(
      "Fill All Fields",
      "Must select a programming language",
      "error"
    );
    return;
  }

  if (!this.code || this.code.trim() === '') {
    Swal.fire(
      "Fill All Fields",
      "Must write programming code",
      "error"
    );
    return;
  }

  // ================= USER CODE =================

  this.userCode = {
    language: this.selectedLanguage,
    userInputCode: this.code,
    exam: {
      id: this.examid,
    },
    user: {
      id: this.userid,
    },
    codingQuestion: {
      id: this.id,
    },
  };

  this.service.setCId(this.id);

  // ================= RESET RESULT =================

  this.executionStatus = '';
  this.passedPercentage = 0;
  this.passedTestCases = 0;
  this.count = 0;
  this.runCodeSuccessfull = false;
  this.showResult = false;
  this.codeOutput = '';

  // ================= GET TEST CASE =================

  this.http
    .get<any[]>(`http://localhost:9033/api/getalltestcases/${this.id}`)
    .subscribe({

      next: (data) => {

        this.Testcase = data;

        const testCase = this.Testcase?.[0];

        if (!testCase) {

          this.executionStatus = 'No Test Cases';
          this.showResult = true;

          return;
        }

        console.log('Test case input:', testCase.input);
        console.log('Expected output:', testCase.expectedOutput);

        // ================= RUN CODE =================

        this.apiService
          .runCode(
            this.code,
            this.selectedLanguage,
            testCase.input
          )
          .subscribe({

            next: (response) => {

              console.log('CODE RESPONSE:', response);

              // ================= COMPILATION ERROR =================

              if (response.compile_output) {

                this.codeOutput = response.compile_output;

                this.executionStatus = 'Compilation Error';
                this.passedTestCases = 0;
                this.passedPercentage = 0;

                this.flag = false;
                this.iscorrect = '';
                this.runCodeSuccessfull = false;

              }

              // ================= EXECUTION ERROR =================

              else if (response.stderr) {

                this.codeOutput = response.stderr;

                this.executionStatus = 'Execution Error';
                this.passedTestCases = 0;
                this.passedPercentage = 0;

                this.flag = false;
                this.iscorrect = '';
                this.runCodeSuccessfull = false;

              }

              // ================= NORMAL OUTPUT =================

              else {

                this.codeOutput = response.stdout ?? '';

                const actualOutput =
                  (response.stdout ?? '').trim();

                const expectedOutput =
                  (testCase.expectedOutput ?? '').trim();

                console.log(
                  'Actual Output:',
                  JSON.stringify(actualOutput)
                );

                console.log(
                  'Expected Output:',
                  JSON.stringify(expectedOutput)
                );

                // ================= CHECK ANSWER =================

                if (actualOutput === expectedOutput) {

                  this.passedTestCases = 1;
                  this.passedPercentage = 100;

                  this.executionStatus = 'Accepted';

                  this.flag = true;
                  this.iscorrect = 'correct';

                  this.runCodeSuccessfull = true;

                }

                else {

                  this.passedTestCases = 0;
                  this.passedPercentage = 0;

                  this.executionStatus = 'Wrong Answer';

                  this.flag = false;
                  this.iscorrect = '';

                  // Keep Submit enabled after running,
                  // same behavior as your previous code
                  this.runCodeSuccessfull = true;
                }

              }

              // ================= SHOW RESULT =================

              this.showResult = true;

              this.sendingBoolean();
              this.emitCodingState();

              console.log(
                'FINAL STATUS:',
                this.executionStatus
              );

              console.log(
                'TEST CASES:',
                this.passedTestCases +
                ' / ' +
                this.Testcase?.length
              );

              console.log(
                'PERCENTAGE:',
                this.passedPercentage
              );
            },

            // ================= API ERROR =================

            error: (error) => {

              console.error(
                'CODE API ERROR:',
                error
              );

              this.codeOutput =
                error?.error?.message ||
                error?.message ||
                'Unable to execute the code.';

              this.executionStatus = 'Execution Error';

              this.passedTestCases = 0;
              this.passedPercentage = 0;

              this.flag = false;
              this.iscorrect = '';
              this.runCodeSuccessfull = false;

              this.showResult = true;

              this.sendingBoolean();
              this.emitCodingState();
            }

          });

      },

      // ================= TEST CASE API ERROR =================

      error: (error) => {

        console.error(
          'TEST CASE API ERROR:',
          error
        );

        this.codeOutput =
          error?.error?.message ||
          error?.message ||
          'Unable to load test case.';

        this.executionStatus = 'Execution Error';

        this.showResult = true;

        this.runCodeSuccessfull = false;

        this.sendingBoolean();
        this.emitCodingState();
      }

    });
}
  submitCode(code: string) {
    this.saveCurrentCode();                   /**This line of code added newly to call saveCurrentCode()  -27.08.2026 */
    console.log(this.id)
    console.log(this.iscorrect)
    console.log('code');
    console.log(code);
    if (!this.selectedLanguage) {
      Swal.fire(
        'Fill All Fields',
        'Must be select the any programming language',
        'error'
      );
      return;
    }

    if (this.code == '') {
      Swal.fire('Fill All Fields', 'Must be write programming code', 'error');
      return;
    }
    const javaUrl='http://localhost:9033/api/savecode'                                    /**Here  http://54.64.6.102:9033/api/savecode changed to localhost:9033   -24.08.2026*/
    this.userCode = {
      language: this.selectedLanguage,                                                    /**Here language: 'java' changed tolanguage: this.selectedLanguage cause in backend it's getting null  -02.09.2026*/
      userInputCode: code,
      iscorrect:this.iscorrect,
      exam: {
        id: this.examid,
      },
      user: {
        id: this.userid,
      },
      codingQuestion: {
        id: this.id,
      },
    };
    this.service.setCId(this.id);
    this.http
      .get(`http://localhost:9033/api/getalltestcases/${this.id}`)                     /**Here http://54.64.6.102:9033/api/getalltestcases/${this.id} changed to localhost:9033   -24.08.2026*/
      .subscribe((data) => {
        this.Testcase?.splice(0, this.Testcase.length);
        this.Testcase = this.Testcase?.concat(data);
        this.count = 0;
        this.Testcase?.forEach((a) => {
          console.log(a.input + 'above');
          this.apiService
            .runCode(code, this.selectedLanguage, a.input)
            .subscribe(
              (response) => {
                console.log(response);
                console.log(response.output);
                console.log(a.expectedOutput);

                // if (response.output.trim() === a.expectedOutput)

                const actualOutput = (response.stdout ?? '').trim();                  /**This line is added newly 183-189*/
                const expectedOutput = (a.expectedOutput ?? '').trim();

console.log('Actual Output:', JSON.stringify(actualOutput));
console.log('Expected Output:', JSON.stringify(expectedOutput));

if (actualOutput === expectedOutput) {
                  {
                  this.count++;
                  console.log(this.count);
                  console.log('Your program is correct.');
                  console.log('F -' + this.count);
                  console.log('F -' + this.passedTestCases);
                  this.passedTestCases = this.count;
                  if (this.passedTestCases == this.Testcase?.length) {
                    this.userCode!.iscorrect = "correct";
                    this.flag = true;
                    this.codingMarks = 5;
                    this.service.codingmarks(this.codingMarks);

                    console.log(this.codingMarks + 'in coding component');
                  } else {
                    console.log('no marks');
                  }
                 }
                // else {
                //   this.flag = false;                                           /**This else block is commented because we commented the if block at */
                //   console.log('your program is incorrect');
                }
                this.sendingBoolean();

           //  this.response=this.response?.concat(response);
          // console.log(this.response)
           //this.codeOutput = this.codeOutput?.concat(response);
    },
    error => {
      console.log(error)
      this.codeOutput = '';
    })
          })
          this.http.post(javaUrl,this.userCode).subscribe(response => {
            console.log('Upload successful!');
            this.runCodeSuccessfull = true;                 /**The two line 669,670 are added newly -27.08.2026 */
             this.emitCodingState();
            Swal.fire("code submitted successfully","", "success");
          }, error => {
            console.error('Upload failed:', error);

          });


      })



    }

  codeMirrorOptions: any = {
    lineNumbers: true,
    theme: 'material',
    mode: 'python',
    indentWithTabs: true,
    smartIndent: true,
    lineWrapping: false,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
  };
  sendingBoolean() {
    this.service.codingBoolean(this.flag);
  }


  // The below emitCodeState(),saveCurrentCode(),ngOnDestroy() method added newly -27.08.2026
  emitCodingState(): void {

  this.codingStateChange.emit({

    questionId: this.id,

    code: this.code,

    language: this.selectedLanguage,

    submitted: this.runCodeSuccessfull,

    executionStatus: this.executionStatus,

    passedTestCases: this.passedTestCases,

    totalTestCases: this.Testcase?.length ?? 0,

    passedPercentage: this.passedPercentage,

    codeOutput: this.codeOutput,

    showResult: this.showResult

  });

}
ngOnDestroy(): void {

  this.emitCodingState();

}

saveCurrentCode(): void {

  if (this.id == null) {
    return;
  }

  this.codeChanged.emit({
    questionId: this.id,
    code: this.code,
    language: this.selectedLanguage
  });
}

// saveCodingCode(event: {
//   questionId: number;
//   code: string;
//   language: string;
// }): void {

//   this.codingCodeMap.set(
//     event.questionId,
//     event.code
//   );

//   this.codingLanguageMap.set(
//     event.questionId,
//     event.language
//   );

//   console.log(
//     'Saved coding code:',
//     event.questionId,
//     event.code
//   );
// }


restoreCodingState(): void {

  if (!this.savedState) {
    return;
  }

  this.code =
    this.savedState.code ?? '';

  this.selectedLanguage =
    this.savedState.language ?? '';

  this.executionStatus =
    this.savedState.executionStatus ?? '';

  this.passedTestCases =
    this.savedState.passedTestCases ?? 0;

  this.passedPercentage =
    this.savedState.passedPercentage ?? 0;

  this.codeOutput =
    this.savedState.codeOutput ?? '';

  this.showResult =
    this.savedState.showResult ?? false;

  this.runCodeSuccessfull =
    this.savedState.submitted ?? false;

  console.log(
    'Restored coding state:',
    this.id,
    this.savedState
  );
}
}
