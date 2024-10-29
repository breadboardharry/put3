import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Socket, io } from 'socket.io-client';
import { APIService } from '../api/api.service';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private _socket: Socket;

    constructor(private api: APIService) {
        this._socket = io(this.api.serverUrl, {
            path: environment.socketPath,
            withCredentials: true,
        });
    }

    get socket() {
        return this._socket;
    }

    public isConnected() {
        return this._socket.connected;
    }

    public disconnect() {
        this._socket.disconnect();
    }
}
