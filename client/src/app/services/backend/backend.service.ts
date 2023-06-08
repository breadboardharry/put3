import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class BackendService {

    private _serverUrl = environment.serverUrl;
    private _apiUrl = this.serverUrl + environment.apiPath;

    constructor(private http: HttpClient) {
        this.alive().then((alive) => {
            if (alive) {
                console.log('Backend is alive');
            } else {
                console.log('Backend is not alive');
            }
        });
    }

    public alive(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.get(this._apiUrl).subscribe({
                next: (res) => resolve(true),
                error: (err) => resolve(false),
            });
        });
    }

    /**
     * Get the server url
     * @returns {string} Server url
     */
    public get serverUrl(): string { return this._serverUrl; }

    /**
     * Get the api url
     * @returns {string} Api url
     */
    public get apiUrl(): string { return this._apiUrl; }
}
