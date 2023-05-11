import { Injectable } from '@angular/core';
import { Fool } from 'src/app/classes/fool';
import { WebSocketService } from '../websocket-service/websocket.service';

@Injectable({
    providedIn: 'root',
})
export class FoolService {

    constructor(private websocket: WebSocketService) {}

    public sendConfig(fool: Fool) {
        this.websocket.socket.emit('layout', {
            target: fool,
            layout: fool.layout
        });
    }
}
