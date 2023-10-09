import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Socket, io } from 'socket.io-client';
import { BackendService } from '../backend/backend.service';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private _socket: Socket;

    constructor(
        private backend: BackendService
    ) {
        // Connect Socket with server URL
        this._socket = io(this.backend.serverUrl, {
            path: environment.socketPath
        });
    }

    get socket() {
        return this._socket;
    }

}
