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
        this._socket = io(this.backend.serverUrl, {
            path: environment.socketPath,
            withCredentials: true
        });
    }

    get socket() {
        return this._socket;
    }

    public isConnected() {
        return this._socket.connected;
    }

    public disconnect() {
        console.log("Disconnecting from socket...");
        this._socket.disconnect();
    }

}
