import {
    HttpClient,
    HttpEvent,
    HttpEventType,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class APIService {
    private _serverUrl = environment.serverUrl;
    private _apiUrl = this.serverUrl + environment.apiPath;

    constructor(private http: HttpClient) {}

    public alive(timeout: number = 20000): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http
                .get('/', {
                    responseType: 'text',
                })
                .subscribe({
                    next: (res) => resolve(true),
                    error: (err) => resolve(false),
                });

            setTimeout(() => resolve(false), timeout);
        });
    }

    /**
     * Get the server url
     * @returns {string} Server url
     */
    public get serverUrl(): string {
        return this._serverUrl;
    }

    /**
     * Get the api url
     * @returns {string} Api url
     */
    public get apiUrl(): string {
        return this._apiUrl;
    }
}

export function apiInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    const apiService = inject(APIService);
    const apiReq = req.clone({
        url: apiService.apiUrl + req.url,
        withCredentials: true,
    });

    return next(apiReq).pipe(
        tap((event) => {
            if (event.type === HttpEventType.Response) {
                // console.log(
                //     req.url,
                //     'returned a response with status',
                //     event.status
                // );
            }
        })
    );
}
