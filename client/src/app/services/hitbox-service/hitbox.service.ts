import { ElementRef, Injectable } from '@angular/core';
import { Hitbox } from 'src/app/interfaces/hitbox';
import { WebSocketService } from '../websocket-service/websocket.service';

@Injectable({
    providedIn: 'root'
})
export class HitboxService {

    private window: (() => any) | undefined;
    public hitboxes: {[key: string]: Hitbox[]} = {
        '_active': [],
    };
    private DEFAULT_HITBOX = {
        size: {
            width: 25,
            height: 25
        },
        position: {
            x: 0,
            y: 0
        },
        events: {},
        active: false
    }

    constructor(private websocket: WebSocketService) { }

    /**
     * Set window element
     * @param window Window element getter
     */
    public setWindow(window: () => ElementRef) {
        this.window = window;
    }

    public get windowSize(): any {
        return {
            width: this.window!().nativeElement.offsetWidth,
            height: this.window!().nativeElement.offsetHeight
        };
    }

    public toXpercent(x: number): number {
        return (x / this.windowSize.width) * 100;
    }

    public toYpercent(y: number): number {
        return (y / this.windowSize.height) * 100;
    }

    /**
     * Add new hitbox to set
     */
    public addNew(id: string = '_active') {
        // Add
        if (this.hitboxes[id]) this.hitboxes[id].push(JSON.parse(JSON.stringify(this.DEFAULT_HITBOX)));
        else this.hitboxes[id] = [JSON.parse(JSON.stringify(this.DEFAULT_HITBOX))];
    }

    /**
     * Import hitboxes
     * @param hitboxes Hitboxes to import
     * @param run Run hitboxes after import
     */
    public import(hitboxes: Hitbox[], run: boolean = false) {
        this.hitboxes['_active'] = hitboxes;
        if (run) this.run();
    }

    /**
     * Run hitboxes
     */
    public run() {
        for (let hitbox of this.hitboxes['_active']) {
            hitbox.active = true;
        }
    }

    /**
     * Update hitboxes to server
     */
    public send(target: any) {
        this.websocket.socket.emit('hitboxes', {
            target: target,
            hitboxes: this.hitboxes[target.id] || [],
        });
    }
}
