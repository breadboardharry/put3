import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { assets } from 'src/app/data/assets';
import { FileData } from 'src/app/types/resources/file-data';
import { environment } from 'src/environments/environment';
import { ResourceType } from 'src/app/enums/resources/type';
import { ResourceDirectory } from 'src/app/enums/resources/directory';
import { ResourceSet } from 'src/app/types/resources/data-set';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

    private apiUrl = environment.serverUrl + environment.apiPath + '/resources';

    constructor(private http: HttpClient) { }

    public typeToDir(type: ResourceType): ResourceDirectory {
        switch (type) {
            case ResourceType.Image:
                return ResourceDirectory.Images;
            case ResourceType.Video:
                return ResourceDirectory.Videos;
            case ResourceType.Audio:
                return ResourceDirectory.Audio;
        }
    }

    public dirToType(dir: ResourceDirectory): ResourceType {
        switch (dir) {
            case ResourceDirectory.Images:
                return ResourceType.Image;
            case ResourceDirectory.Videos:
                return ResourceType.Video;
            case ResourceDirectory.Audio:
                return ResourceType.Audio;
        }
    }

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
     * Get all resources data
     * @returns {Promise<ResourceSet>} Resources
     */
    public getData(): Promise<ResourceSet> {
        return new Promise<ResourceSet>((resolve, reject) => {
            this.http.get<ResourceSet>(this.apiUrl, {
                responseType: 'json'
            }).subscribe((data: ResourceSet) => {
                resolve(data);
            });
        });
    }

    /**
     * Get resources data by type
     * @param {ResourceType} type Resource type
     * @returns {Promise<FileData[]>} Resources
     */
    public getDataByType(type: ResourceType): Promise<FileData[]> {
        const endpoint = this.apiUrl + this.typeToDir(type);

        return new Promise<FileData[]>((resolve, reject) => {
            this.http.get<FileData[]>(endpoint, {
                responseType: 'json'
            }).subscribe((data: FileData[]) => {
                resolve(data);
            });
        });
    }

    public flatten(set: ResourceSet) {
        let result: any[] = [];

        for (let files of Object.values(set)) {
            result = result.concat(files);
        }

        return result;
    }

    /**
     * Delete multiple images from the server
     * @param {string[]} filenames Filenames to delete
     * @returns {Promise<any>} Server result
     */
    public delete(filenames: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.delete(this.apiUrl, {
                responseType: 'json',
                body: filenames
            })
            .subscribe((data: any) => resolve(data));
        });
    }

    /**
     * Rename an image on the server
     * @returns {Promise<any>} Server result
     */
    public rename(currentName: string, newName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.post(this.apiUrl + '/rename', {
                currentName,
                newName
            },{
                responseType: 'json',
            })
            .subscribe((data: any) => resolve(data));
        });
    }

    addFiles(file: File) {
        let arr: any[] = [];
        let formData = new FormData();

        arr.push(file);
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
