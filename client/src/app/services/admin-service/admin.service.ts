import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodeName } from 'src/app/enums/code';
import { BackendService } from '../backend/backend.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {

    constructor(
        private backend: BackendService,
        private http: HttpClient
    ) {}

    /**
     * Authenticate user with a code
     * @param code Code
     */
    public login(code: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(
                    this.backend.apiUrl + '/admin/login',
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
     * @returns True if the user is logged
     */
    public isLogged(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.get(this.backend.apiUrl + '/admin/islogged', {
                    responseType: 'json',
                    withCredentials: true
            })
            .subscribe({
                next: (res: any) => { resolve(res.isAdmin) },
                error: (err) => { resolve(false) }
            });
        });
    }

    /**
     * Get the length of a code
     * @param codeName Name of the code
     * @returns Code length
     */
    public getCodeLength(codeName: CodeName): Promise<number> {
        return new Promise((resolve, reject) => {
            this.http.get<number>(
                this.backend.apiUrl + '/admin/codelen/' + codeName,
                { responseType: 'json' }
            )
            .subscribe((length: number) => {
                resolve(length);
            });
        });
    }

    public logout(): void {
        this.http.get(
            this.backend.apiUrl + '/admin/logout',
            { responseType: 'json', withCredentials: true }
        ).subscribe(() => {
            window.location.replace('/');
        });
    }
}
