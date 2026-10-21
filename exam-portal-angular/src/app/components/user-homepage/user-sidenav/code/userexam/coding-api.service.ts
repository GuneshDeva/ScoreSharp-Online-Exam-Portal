import { UserCode } from './../../../../../model/model/UserCode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodingApiService {

  userCode?: UserCode;

  private judge0Url = 'https://ce.judge0.com/submissions?wait=true';

  constructor(private http: HttpClient) {}

  runCode(
    code: string,
    language: string,
    input?: string
  ): Observable<any> {

    // Convert your application's language name
    // into Judge0's language ID.
    const languageIds: { [key: string]: number } = {

      java: 62,
      py: 71,
      c: 50,
      cpp: 54,
      go: 60,
      cs: 51,
      js: 63

    };

    const languageId = languageIds[language];

    if (!languageId) {
      throw new Error('Unsupported programming language: ' + language);
    }

    let sourceCode = code;

if (language === 'java') {
  sourceCode = code.replace(
    /public\s+class\s+[A-Za-z_$][A-Za-z0-9_$]*/,
    'public class Main'
  );
}
    const body = {
      language_id: languageId,
      source_code: sourceCode,     // ✅ CHANGED HERE
      stdin: input || ''
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Sending code to Judge0:');
    console.log('Language:', language);
    console.log('Language ID:', languageId);
    console.log('Input:', input);
    console.log('Code:', code);

    return this.http.post(
      this.judge0Url,
      body,
      { headers: headers }
    );
  }
}




















// The below code was the codeX api server which compiles the code and returns the output, but the 'codeX' server is down so i'm adding 'judge0' server to compile code


// import { UserCode } from './../../../../../model/model/UserCode';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import * as qs from 'qs';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CodingApiService {

//   userCode?:UserCode

//   constructor(private http : HttpClient) { }

//   runCode(code: string, language: string,input?: string): Observable<any> {
//     const url = 'https://api.codex.jaagrav.in';

//     const headers = new HttpHeaders({
//       'Content-Type': 'application/x-www-form-urlencoded'
//     });


//     const data = {
//       'code': code,
//       'language': language,
//        'input': input
//     };
//     const headersInJava = new HttpHeaders({
//       'Content-Type': 'application/octet-stream'
//     });
//    // const headersInJava = { 'Content-Type': 'application/octet-stream' };


// // //     const text = "Hello, world!";
// // const  encoder = new TextEncoder();
// //  const bytes = encoder.encode(code);
// // const userCode: { code?: Uint8Array } = { code: bytes };





//     return this.http.post(url, qs.stringify(data), { headers: headers });
//   }

// }








