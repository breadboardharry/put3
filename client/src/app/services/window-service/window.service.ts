import { Injectable } from '@angular/core';
import { Window } from 'put3-models';

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
            ratio: this.getWindowRatio(),
        }
    }

    public static isFullscreen(): boolean {
        return document.fullscreenElement ? true : false;
    }

    public static toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    public static openFullscreen(): void {
        document.documentElement.requestFullscreen();
    }

    public static closeFullscreen(): void {
        document.exitFullscreen();
    }

}
