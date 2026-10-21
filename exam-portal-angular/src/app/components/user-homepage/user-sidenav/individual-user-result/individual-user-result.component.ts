import { HttpClient } from '@angular/common/http';
import { Component,ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { Marks } from 'src/app/model/model/Marks';
import{Chart,registerables}from 'node_modules/chart.js';
Chart.register(...registerables);
import 'chartjs-plugin-datalabels';
import { MatPaginator } from '@angular/material/paginator';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';





@Component({
  selector: 'app-individual-user-result',
  templateUrl: './individual-user-result.component.html',
  styleUrls: ['./individual-user-result.component.css']
})
export class IndividualUserResultComponent {

  marks:Marks[]=[];
  nameFilterValue = '';
  activeButton: string = '';
  userName:string=''
  // id2:any;


  dataSource = new MatTableDataSource<Marks>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http:HttpClient,private route:ActivatedRoute) {
  }


  ngOnInit(): void {

    // this.route.parseUrl

    this.getMarks().subscribe((data)=>{this.marks=data
                                    this.dataSource.data=this.marks
                                    this.dataSource.paginator = this.paginator;
                                })

  }

  getMarks(): Observable<Marks[]> {
    return this.route.paramMap.pipe(
      switchMap(params => {
        const id2 = params.get('id2');
        console.log("id result" + id2); // Use the retrieved value as needed
        return this.http.get<Marks[]>(`http://localhost:9033/api/getmarks/${id2}`);           /**Here http://54.64.6.102:9033/api/getmarks/${id2} changed to localhost:9033 */
      })
    );
  }


  displayedColumns: string[] = ['serialNumber', 'examCode','totalMarks', 'obtainedMarks'];



//For Searching
  applyFilter(event: Event): void {
    console.log("apply")
    console.log(this.marks)
    const nameFilterValue = this.nameFilterValue.trim().toLowerCase();
    console.log(this.nameFilterValue)

    this.dataSource.filterPredicate = (data: Marks) => {
      const codeMatch = data.exam?.code?.trim().toLowerCase().includes(nameFilterValue );
      const marksMatch = data.marks === parseInt(nameFilterValue);
      const totalmarksMatch = data.totalMarks === parseInt(nameFilterValue);
      return !!(codeMatch ||  marksMatch || totalmarksMatch);
    };

    const filterValue = `${nameFilterValue}`;
    this.dataSource.filter = filterValue;
    console.log(this.dataSource.filter)
  }



  // generatePDF(): void {
  //   var i=1;
  //   const filteredData = this.dataSource.filteredData;
  //   const docDefinition: TDocumentDefinitions = {
  //     content: [
  //       {
  //         text: 'Exam Result Data',
  //         style: 'header'
  //       },
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['auto','auto', 'auto', 'auto'],
  //           body: [
  //             [
  //               'Serial Number',
  //               'Exam Code',
  //               'Total Marks',
  //               'Obtained Marks'
  //             ],
  //             ...filteredData.map(d => [
  //               i++ || "",
  //               d.exam?.code || "",
  //               d.totalMarks || 0,
  //               d.marks || 0

  //             ])
  //           ]
  //         }
  //       }
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         margin: [0, 0, 0, 10]
  //       }
  //     }
  //   };
  //   pdfMake.createPdf(docDefinition).open();
  // }


  // The below generatePDF() was added newly and the old method was commnetted above  -02.09.2026
  generatePDF(): void {

  const filteredData = this.dataSource.filteredData;

  if (!filteredData || filteredData.length === 0) {
    alert('No exam result data available.');
    return;
  }

  const userId = this.route.snapshot.paramMap.get('id2');

  if (!userId) {
    alert('User ID not found.');
    return;
  }

  // Get exam ID directly from Marks response
  const examId = filteredData[0].exam?.id;

  if (!examId) {
    alert('Exam ID not found.');
    return;
  }

  console.log('PDF User ID:', userId);
  console.log('PDF Exam ID:', examId);

  // Get submitted coding answers
  this.http
    .get<any[]>(
      `http://localhost:9033/api/getusercodes/${userId}/${examId}`
    )
    .subscribe({

      next: (codingData) => {

        console.log('Coding data:', codingData);

        let serialNumber = 1;

        // =====================================
        // RESULT TABLE
        // =====================================

        const resultTableBody: any[] = [

          [
            'Serial Number',
            'Exam Code',
            'Total Marks',
            'Obtained Marks'
          ]

        ];

        filteredData.forEach(d => {

          resultTableBody.push([

            serialNumber++,

            d.exam?.code || '',

            d.totalMarks || 0,

            d.marks || 0

          ]);

        });


        // =====================================
        // PDF CONTENT
        // =====================================

        const pdfContent: any[] = [

          {
            text: 'Exam Result Data',
            style: 'header'
          },

          {
            table: {

              headerRows: 1,

              widths: [
                'auto',
                'auto',
                'auto',
                'auto'
              ],

              body: resultTableBody

            },

            layout: 'lightHorizontalLines'

          }

        ];


        // =====================================
        // CODING QUESTION DETAILS
        // =====================================

        if (codingData && codingData.length > 0) {

          pdfContent.push({

            text: 'Coding Question Details',

            style: 'sectionHeader',

            margin: [0, 20, 0, 10]

          });


          codingData.forEach(
            (codingAnswer: any, index: number) => {

              // ---------------------------------
              // QUESTION
              // ---------------------------------

              const questionHtml =
                codingAnswer.codingQuestion?.content || '';

              // Remove HTML tags
              const questionText =
                questionHtml
                  .replace(/<[^>]*>/g, '')
                  .replace(/&amp;/g, '&')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .trim();


              // ---------------------------------
              // LANGUAGE
              // ---------------------------------

              const language =
                codingAnswer.language
                  ? codingAnswer.language.toUpperCase()
                  : 'NOT SPECIFIED';


              // ---------------------------------
              // SUBMITTED CODE
              // ---------------------------------

              const submittedCode =
                codingAnswer.userInputCode ||
                'No code submitted';


              // ---------------------------------
              // RESULT
              // ---------------------------------

              const result =
                codingAnswer.iscorrect
                  ? codingAnswer.iscorrect.toUpperCase()
                  : 'NOT EVALUATED';


              // =================================
              // QUESTION HEADER
              // =================================

              pdfContent.push({

                text:
                  `Coding Question ${index + 1}`,

                style: 'questionHeader',

                margin: [0, 15, 0, 8]

              });


              // =================================
              // QUESTION
              // =================================

              pdfContent.push({

                text: [

                  {
                    text: 'Question:\n',
                    bold: true
                  },

                  questionText

                ],

                margin: [0, 0, 0, 8]

              });


              // =================================
              // LANGUAGE
              // =================================

              pdfContent.push({

                text: [

                  {
                    text: 'Language: ',
                    bold: true
                  },

                  language

                ],

                margin: [0, 0, 0, 8]

              });


              // =================================
              // RESULT
              // =================================

              pdfContent.push({

                text: [

                  {
                    text: 'Result: ',
                    bold: true
                  },

                  result

                ],

                margin: [0, 0, 0, 8]

              });


              // =================================
              // SUBMITTED CODE
              // =================================

              pdfContent.push({

                text: 'Submitted Code:',

                bold: true,

                margin: [0, 5, 0, 5]

              });


              pdfContent.push({

                text: submittedCode,

                fontSize: 9,

                margin: [10, 5, 10, 15],

                preserveLeadingSpaces: true

              });


              // =================================
              // SEPARATOR
              // =================================

              pdfContent.push({

                canvas: [

                  {

                    type: 'line',

                    x1: 0,
                    y1: 0,

                    x2: 515,
                    y2: 0,

                    lineWidth: 0.5

                  }

                ],

                margin: [0, 5, 0, 10]

              });

            }

          );

        }


        // =====================================
        // PDF DEFINITION
        // =====================================

        const docDefinition:
          TDocumentDefinitions = {

          content: pdfContent,

          styles: {

            header: {

              fontSize: 18,

              bold: true,

              margin: [0, 0, 0, 10]

            },

            sectionHeader: {

              fontSize: 16,

              bold: true

            },

            questionHeader: {

              fontSize: 13,

              bold: true

            }

          }

        };


        // =====================================
        // OPEN PDF
        // =====================================

        pdfMake
          .createPdf(docDefinition)
          .open();

      },


      error: (error) => {

        console.error(
          'Error getting coding answers:',
          error
        );

        alert(
          'Unable to load coding answers for PDF.'
        );

      }

    });

}

}
