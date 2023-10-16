import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { Session, SessionData } from 'src/app/classes/session';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class SessionService {

    constructor(
        private backend: BackendService,
        private http: HttpClient,
        private cookie: CookieService
    ) {}

    public saveInCookies(sessionCode: string): void {
        this.cookie.set('session', sessionCode, undefined, '/');
    }

    public getFromCookies(): string {
        return this.cookie.get('session');
    }

    public removeFromCookies(): void {
        this.cookie.delete('session', '/');
    }

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
