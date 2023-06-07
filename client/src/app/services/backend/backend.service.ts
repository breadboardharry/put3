import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class BackendService {

    private _serverUrl = environment.serverUrl;
    private _apiUrl = this.serverUrl + environment.apiPath;

    constructor() {}

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
