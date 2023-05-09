import { Injectable } from '@angular/core';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { WebSocketService } from '../websocket-service/websocket.service';
import { Size } from 'src/app/interfaces/size';

@Injectable({
    providedIn: 'root'
})
export class HitboxService {

    public window: Size = {
        width: 0,
        height: 0
    };
    public hitboxes: Hitbox[] = [];

    constructor(private websocket: WebSocketService) { }

    public setWindow(window: Size) {
        this.window = window;
    }

    /**
     * Add new hitbox to set
     */
    public addNew() {
        // Add new hitbox only if not running
        this.hitboxes.push({
            size: {
                width: 88,
                height: 88
            },
            position: {
                x: 0,
                y: 0
            },
            events: [],
            active: false
        });
    }

    /**
     * Import hitboxes
     * @param hitboxes Hitboxes to import
     * @param run Run hitboxes after import
     */
    public import(hitboxes: Hitbox[], run: boolean = false) {
        this.hitboxes = hitboxes;
        console.log(this.hitboxes);
        if (run) this.run();
    }

    /**
     * Run hitboxes
     */
    public run() {
        for (let hitbox of this.hitboxes) {
            hitbox.active = true;
        }
    }

    /**
     * Update hitboxes to server
     */
    public send(target: any) {
        this.websocket.socket.emit('hitboxes', {
            target: target,
            hitboxes: this.format(this.hitboxes),
        });
    }

    public format(hitboxes: Hitbox[]): Hitbox[] {
        // CLone the array
        let hitboxesCopy = JSON.parse(JSON.stringify(hitboxes));

        // Modify the values to be percentages
        return hitboxesCopy.map((hitbox: Hitbox) => {
            hitbox.position.x = Math.round((hitbox.position.x / this.window.width) * 100);
            hitbox.position.y = Math.round((hitbox.position.y / this.window.height) * 100);
            hitbox.size.width = Math.round((hitbox.size.width / this.window.width) * 100);
            hitbox.size.height = Math.round((hitbox.size.height / this.window.height) * 100);
            return hitbox;
        });
    }
}
