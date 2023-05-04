import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { assets } from 'src/app/data/assets';
import { FileData } from 'src/app/types/file-data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  private apiUrl = environment.serverUrl + environment.apiPath;

  constructor(private http: HttpClient) { }

  public getFlattenSounds(): string[] {
    const dir = assets['sounds'];
    return this.flattenObject(dir);
  }

  public flattenObject(obj: any, path: string = '') {
    let result: any[] = [];

    for (let key in obj) {
      let newPath = path ? path + '/' + key : key;

      if (Array.isArray(obj[key])) {
        result = result.concat(obj[key].map((item: any) => newPath + '/' + item));
      }
      else if (typeof obj[key] === 'object') {
        result = result.concat(this.flattenObject(obj[key], newPath));
      }
    }
    return result;
  }

    /**
     * Get server hosted images data
     * @returns {Promise<FileData[]>} Image data array
     */
    public getServerImages(): Promise<FileData[]> {
        return new Promise<FileData[]>((resolve, reject) => {
            this.http.get<FileData[]>(this.apiUrl + '/images', {
                responseType: 'json'
            }).subscribe((data: FileData[]) => resolve(data));
        });
    }

    /**
     * Delete multiple images from the server
     * @returns {Promise<any>} Server result
     */
    public deleteImages(imagenames: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.delete(this.apiUrl + '/resources/images', {
                responseType: 'json',
                body: imagenames
            }).subscribe((data: any) => resolve(data));
        });
    }

    

    addFiles(images: File) {
        let arr: any[] = [];
        let formData = new FormData();

        arr.push(images);
        arr[0].forEach((item: any, i: any) => {
            formData.append('file', arr[0][i]);
        })

        return this.http.post(this.apiUrl + '/upload', formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            catchError(this.errorMgmt)
        )
    }

    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        }
        else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}
