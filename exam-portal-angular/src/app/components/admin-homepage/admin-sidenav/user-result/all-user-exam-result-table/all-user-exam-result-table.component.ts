import { HttpClient } from '@angular/common/http';
import { Component,ViewChild, EventEmitter, Output } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { Marks } from 'src/app/model/model/Marks';
import{Chart,registerables}from 'node_modules/chart.js';
Chart.register(...registerables);
import 'chartjs-plugin-datalabels';
import { MatPaginator } from '@angular/material/paginator';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { FormControl } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { ScheduleExam } from 'src/app/model/model/ScheduleExam';
import Swal from 'sweetalert2';

const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

export interface PeriodicElement {
  serialNumber: number;
  examCode: string;
  name: string;
  totalMarks: number;
  obtainedMarks :number;
}


@Component({
  selector: 'app-all-user-exam-result-table',
  templateUrl: './all-user-exam-result-table.component.html',
  styleUrls: ['./all-user-exam-result-table.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AllUserExamResultTableComponent {

  @Output("loadAllUserExamResultTable")  loadAllUserExamResultTable=new EventEmitter();
  Exams?: ScheduleExam[];

  selectedexam?:any;

  goBack(){
    this.loadAllUserExamResultTable.emit(true);
  }

  allUserExamResult=true;
  showPieChart: boolean = false;
  marks:Marks[]=[];
  examcode1?:string;
  above80:number=0;
  above60:number=0;
  above35:number=0;
  fail:number=0;
  userMarks?:Marks[]=[];
  username?:string;
  username2?:string;
  examchart?:boolean;
  userchart?:boolean;
  userexamresult?:false;
  username3?:string;
  examname?:string;
  totalmarks?:number;
  gotmarks?:number;
  chart1: any;
  chart2: any;
  examchart1:any
  examchart2:any;
  nameFilterValue = '';
  codeFilterValue = '';
  ueseexammarks?:number[]=[];
  examcode:string[]=[]
  isHidden:boolean=false;

  dataSource = new MatTableDataSource<Marks>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http:HttpClient) {
  }


  ngOnInit(): void {


  }

  getMarks():Observable<Marks[]>{
    return this.http.get<Marks[]>(`http://localhost:9033/api/getmarks`)
  }

  displayedColumns: string[] = ['serialNumber', 'examCode', 'name', 'totalMarks', 'obtainedMarks'];

 //rounting
 loadAllUserResult(flag:boolean){
  this.allUserExamResult=flag;
 }

//For Searching
  applyFilter(event: Event): void {
    const nameFilterValue = this.nameFilterValue.trim().toLowerCase();
    console.log(this.nameFilterValue)

    this.dataSource.filterPredicate = (data: Marks, filter: string) => {
      const nameMatch = data.user?.name?.trim().toLowerCase().includes(nameFilterValue);
      const codeMatch = data.exam?.code?.trim().toLowerCase().includes(nameFilterValue );
      const marksMatch = data.marks === parseInt(nameFilterValue);
      const totalmarksMatch = data.totalMarks === parseInt(nameFilterValue);
      const idMatch = data.id === parseInt(nameFilterValue);
      return !!(nameMatch || codeMatch ||  marksMatch || totalmarksMatch || idMatch);
    };

    const filterValue = `${nameFilterValue}`;
    this.dataSource.filter = filterValue;
    console.log(this.dataSource.filter)
  }



  generatePDF(): void {
    var i=1;
    const filteredData = this.dataSource.filteredData;
    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: 'Exam Result Data',
          style: 'header'
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                'S.No',
                'Exam Code',
                'User Name',
                'Total Marks',
                'Obtained Marks'
              ],
              ...filteredData.map(d => [
                i++ || "",
                d.exam?.code || "",
                d.user?.name || "",
                d.totalMarks || 0,
                d.marks || 0

              ])
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };
    pdfMake.createPdf(docDefinition).open();
  }



  byExamId(){
    this.http.get<Marks[]>(`http://localhost:9033/api/marks/1`).subscribe((data)=>{
      console.warn(data)
    })
  }
  date = new FormControl(moment());



chosenYearHandler(normalizedYear: Moment, dp: any) {

  this.isHidden = true;

  const ctrlValue = this.date.value;

  if (ctrlValue) {
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  dp.close();

  const year = normalizedYear.year();

  console.log("Selected Year:", year);

  // Clear old data
  this.Exams = [];
  this.selectedexam = undefined;
  this.marks = [];
  this.dataSource.data = [];

  // Get exams for selected year
  this.http.get<ScheduleExam[]>(
    `http://localhost:9033/api/getexamsbyyear/${year}`
  )
  .subscribe({
    next: (data: ScheduleExam[]) => {

      console.log("Exams scheduled in", year, ":", data);

      if (data.length > 0) {

        // Exams found
        this.Exams = data;

      } else {

        // No exams found for selected year
        this.http.get<ScheduleExam[]>(
          `http://localhost:9033/api/getallexams`
        )
        .subscribe({
          next: (allExams: ScheduleExam[]) => {

            // Get unique years from all exams
            const availableYears = [
              ...new Set(
                allExams
                  .filter(exam => exam.startTime)
                  .map(exam =>
                    new Date(exam.startTime!).getFullYear()
                  )
              )
            ].sort((a, b) => a - b);

            if (availableYears.length > 0) {

              Swal.fire({
                icon: 'info',
                title: 'No Exams Found',
                html:
                  `No exams were conducted in <b>${year}</b>.<br><br>` +
                  `Exams are available for the year(s):<br>` +
                  `<b>${availableYears.join(', ')}</b>`,
                confirmButtonText: 'OK'
              });

            } else {

              Swal.fire({
                icon: 'info',
                title: 'No Exams Available',
                text: 'There are no exams available in the system.',
                confirmButtonText: 'OK'
              });
            }
          },

          error: (error) => {

            console.error("Error getting all exams:", error);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Unable to check available exam years.`,
              confirmButtonText: 'OK'
            });
          }
        });
      }
    },

    error: (error) => {

      console.error("Error getting exams by year:", error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Unable to get exams for ${year}. Please try again.`,
        confirmButtonText: 'OK'
      });
    }
  });
}


 onExamSelection() {

  console.log("Selected Exam ID:", this.selectedexam);

  // Clear previous results first
  this.marks = [];
  this.dataSource.data = [];

  this.http.get<Marks[]>(
    `http://localhost:9033/api/marks/${this.selectedexam}`
  ).subscribe({

    next: (data) => {

      console.log("Students who wrote this exam:", data);

      // Find the selected exam details
      const selectedExam = this.Exams?.find(
        exam => exam.id === this.selectedexam
      );

      const examName = selectedExam?.name || 'Selected exam';
      const examCode = selectedExam?.code || '';

      // Check whether any user wrote the exam
      if (data.length === 0) {

        Swal.fire({
          icon: 'info',
          title: 'No Users Found',
          html:
            `No users have written <b>${examName}</b>` +
            `${examCode ? ` (${examCode})` : ''} yet.`,
          confirmButtonText: 'OK'
        });

        // Keep table empty
        this.marks = [];
        this.dataSource.data = [];

        return;
      }

      // Users found
      this.marks = data;

      this.dataSource.data = data.sort((a, b) => {
        return (b.marks ?? 0) - (a.marks ?? 0);
      });

      this.dataSource.paginator = this.paginator;

    },

    error: (error) => {

      console.error("Error getting exam results:", error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to get exam results. Please try again.',
        confirmButtonText: 'OK'
      });
    }
  });
}





}
