import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodeName } from 'src/app/enums/code';
import { BackendService } from '../backend/backend.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private backend: BackendService, private http: HttpClient) {}

    /**
     * Authenticate user with a code
     * @param {string} code Code
     */
    public login(code: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(
                    this.backend.apiUrl + '/auth/login',
                    { code },
                    {
                        responseType: 'json',
                        withCredentials: true
                    },
                )
                .subscribe((res: any) => {
                    resolve(res);
                });
        });
    }

    /**
     * Check if the user is logged
     * @returns {Promise<boolean>} True if the user is logged
     */
    public isLogged(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.get(this.backend.apiUrl + '/auth/islogged',
                {
                    responseType: 'json',
                    withCredentials: true
                },
            )
            .subscribe({
                next: (res: any) => { resolve(res.logged) },
                error: (err) => { resolve(false) }
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
                this.backend.apiUrl + '/auth/codelen/' + codeName,
                { responseType: 'json' }
            )
            .subscribe((length: number) => {
                resolve(length);
            });
        });
    }
}
