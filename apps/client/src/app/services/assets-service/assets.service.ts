import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnumFoolScript } from 'src/app/app-models/enums/scripts';
import { download } from 'src/app/utilities/download';

@Injectable({
    providedIn: 'root',
})
export class AssetsService {
    constructor(private http: HttpClient) {}

    downloadScript(script: EnumFoolScript) {
        this.getScript(script).then((file: Blob) => {
            download(file, script);
        });
    }

    getScript(script: EnumFoolScript): Promise<Blob> {
        return new Promise<Blob>((resolve, reject) => {
            this.http
                .get('/scripts/' + script, {
                    responseType: 'blob',
                })
                .subscribe({
                    next: (file: Blob) => resolve(file),
                    error: (err) => reject(err),
                });
        });
    }
}
