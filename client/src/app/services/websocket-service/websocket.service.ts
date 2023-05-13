import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { Role } from 'src/app/enums/role';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private _socket: any;
    private _id: string = '';
    private _role: Role = Role.Undefined;

    constructor() {
        // Connect Socket with server URL
        this._socket = io(environment.serverUrl, {
            path: environment.socketPath
        });

        // Get ID from server
        this._socket.on('id', (id :string) => {
            this._id = id;
            console.log('ID: ' + this._id);
            this.socket.off('id');
        });
    }

    get socket() {
        return this._socket;
    }

    get id() {
        return this._id;
    }

    get role() {
        return this._role;
    }

    set role(role: Role) {
        this._role = role;
    }

    public declare(role: Role, preferences: {} = {}) {
        this._role = role;
        this._socket.emit('role', {
            role,
            preferences
        });
    }
}
