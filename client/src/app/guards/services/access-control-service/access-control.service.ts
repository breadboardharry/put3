import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodeName } from 'src/app/enums/code';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  private apiUrl = environment.serverUrl + environment.apiPath;

  constructor(private http: HttpClient) { }

  /**
   * Check if a code is valid
   * @param {string} codeName Name of the code
   * @param {string} code Code to check
   * @returns {Promise<boolean>} Is valid
   */
  public checkCode(codeName: CodeName, code: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<boolean>(
        this.apiUrl + '/access-control/check/code/' + codeName,
        { code: code },
        { responseType: 'json' }
      ).subscribe((valid: boolean) => {
        resolve(valid);
      });
    });
  }

  /**
   * Get the length of a code
   * @param {string} codeName Name of the code
   * @returns {Promise<number>} Code length
   */
  public getCodeLength(codeName: CodeName): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.get<number>(
        this.apiUrl + '/access-control/get/code/length/' + codeName,
        { responseType: 'json' }
      ).subscribe((length: number) => {
        resolve(length);
      });
    });
  }
}
