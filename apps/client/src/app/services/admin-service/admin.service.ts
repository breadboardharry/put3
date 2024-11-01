import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionService } from '../session-service/session.service';
import { APIResponse } from '@put3/types';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    constructor(
        private http: HttpClient,
        private sessionService: SessionService
    ) {}

    /**
     * Authenticate user with a code
     * @param code Code
     */
    public login(code: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http
                .post<APIResponse>(
                    '/admin/login',
                    { code },
                    {
                        responseType: 'json',
                    }
                )
                .subscribe((res) => {
                    resolve(res.success);
                });
        });
    }

    /**
     * Check if the user is logged
     * @returns True if the user is logged
     */
    public isLogged(): Promise<boolean> {
        return new Promise((resolve) => {
            this.http
                .get<APIResponse<{ isAdmin: boolean }>>('/admin/islogged', {
                    responseType: 'json',
                })
                .subscribe({
                    next: (res) => {
                        resolve(res.data.isAdmin);
                    },
                    error: () => {
                        resolve(false);
                    },
                });
        });
    }

    /**
     * Get the length of a code
     * @returns Code length
     */
    public getCodeLength(): Promise<number> {
        return new Promise((resolve) => {
            this.http
                .get<APIResponse<number>>('/admin/codelen', {
                    responseType: 'json',
                })
                .subscribe((res) => {
                    resolve(res.data);
                });
        });
    }

    public logout(): void {
        this.sessionService.removeFromCookies();
        this.http
            .get<APIResponse>('/admin/logout', {
                responseType: 'json',
            })
            .subscribe(() => {
                window.location.replace('/');
            });
    }
}
