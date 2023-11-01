import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileService } from '../utils/file-service/file.service';
import { BackendService } from '../backend/backend.service';
import { EnumFoolScript } from 'src/app/app-models/enums/scripts';

@Injectable({
    providedIn: 'root',
})
export class AssetsService {

    constructor(private backend: BackendService, private fileService: FileService, private http: HttpClient) {}

    downloadScript(script: EnumFoolScript) {
        this.getScript(script).then((file: Blob) => {
            this.fileService.download(file, script);
        });
    }

    getScript(script: EnumFoolScript): Promise<Blob> {
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
