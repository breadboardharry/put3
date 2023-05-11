import { Injectable } from '@angular/core';
import { Script } from 'src/app/enums/assets/scrips';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FileService } from '../utils/file-service/file.service';

@Injectable({
    providedIn: 'root',
})
export class AssetsService {

    private apiUrl = environment.serverUrl + environment.apiPath;

    constructor(private fileService: FileService, private http: HttpClient) {}

    downloadScript(script: Script) {
        this.getScript(script).then((file: Blob) => {
            this.fileService.download(file, script);
        });
    }

    getScript(script: Script): Promise<Blob> {
        return new Promise<Blob>((resolve, reject) => {
            this.http.get(this.apiUrl + '/scripts/' + script , {
                responseType: 'blob'
            }).subscribe({
                next: (file: Blob) => resolve(file),
                error: (err) => reject(err)
            });
        });
    }
}
