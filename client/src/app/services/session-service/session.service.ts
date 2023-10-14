import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { Session, SessionData } from 'src/app/classes/session';

@Injectable({
    providedIn: 'root',
})
export class SessionService {

    constructor(
        private backend: BackendService,
        private http: HttpClient
    ) {}

    public getAll(): Promise<Session[]> {
        return new Promise((resolve, reject) => {
            this.http.get(this.backend.apiUrl + '/session/', {
                responseType: 'json',
                withCredentials: true
            })
            .subscribe({
                next: (res: any) => {
                    resolve(res.sessions.map((data: SessionData) => new Session(data)))
                },
                error: (err) => { reject(err) }
            });
        });
    }

    /**
     * Check if a session code is valid
     */
    public exists(code: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.get(this.backend.apiUrl + '/session/exists?code=' + code, {
                responseType: 'json',
                withCredentials: true
            })
            .subscribe({
                next: (res: any) => { resolve(res.success) },
                error: (err) => { resolve(false) }
            });
        });
    }

}
