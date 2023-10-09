import { ElementRef, Injectable } from '@angular/core';
import { Hitbox } from 'src/app/classes/hitbox';

@Injectable({
    providedIn: 'root'
})
export class HitboxService {

    private window: (() => any) | undefined;

    constructor() { }

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
     * Instanciate hitboxes
     * @param hitboxes Hitboxes
     * @param run Run hitboxes (default: false)
     * @returns Hitboxes
     */
    public instaciate(hitboxes: any, run: boolean = false): Hitbox[] {
        const active = run ? {active: true} : {};
        return hitboxes.map((hitbox: any) => new Hitbox({...hitbox, active}));
    }
}
