import { Injectable } from '@angular/core';
import { Script } from 'src/app/enums/assets/scrips';
import { HttpClient } from '@angular/common/http';
import { FileService } from '../utils/file-service/file.service';
import { BackendService } from '../backend/backend.service';

@Injectable({
    providedIn: 'root',
})
export class AssetsService {

    constructor(private backend: BackendService, private fileService: FileService, private http: HttpClient) {}

    downloadScript(script: Script) {
        this.getScript(script).then((file: Blob) => {
            this.fileService.download(file, script);
        });
    }

    getScript(script: Script): Promise<Blob> {
        return new Promise<Blob>((resolve, reject) => {
            this.http.get(this.backend.apiUrl + '/scripts/' + script , {
                responseType: 'blob'
            }).subscribe({
                next: (file: Blob) => resolve(file),
                error: (err) => reject(err)
            });
        });
    }
}
