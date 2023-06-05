import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodeName } from 'src/app/enums/code';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AccessControlService {
    private apiUrl = environment.serverUrl + environment.apiPath;

    constructor(private http: HttpClient) {}

    /**
     * Authenticate user with a code
     * @param {string} code Code
     */
    public login(code: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.http.post(
                    this.apiUrl + '/auth/login',
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
            this.http.get(this.apiUrl + '/auth/islogged',
                {
                    responseType: 'json',
                    withCredentials: true
                },
            )
            .subscribe({
                next: (res: any) => {
                    resolve(res.success);
                },
                error: (err) => {
                    resolve(false);
                }
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
                this.apiUrl + '/auth/codelen/' + codeName,
                { responseType: 'json' }
            )
            .subscribe((length: number) => {
                resolve(length);
            });
        });
    }
}
