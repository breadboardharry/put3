import { Injectable } from '@angular/core';
import { Window } from 'src/app/types/window';

@Injectable({
    providedIn: 'root',
})
export class WindowService {

    constructor() {}

    public getWindowHeight(): number {
        return window.innerHeight;
    }

    public getWindowWidth(): number {
        return window.innerWidth;
    }

    public getWindowRatio(): number {
        return this.getWindowWidth() / this.getWindowHeight();
    }

    public getWindowSize(): Window {
        return {
            width: this.getWindowWidth(),
            height: this.getWindowHeight(),
            ratio: this.getWindowRatio()
        }
    }
}
