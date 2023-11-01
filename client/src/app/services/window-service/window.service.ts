import { Injectable } from '@angular/core';
import { Window } from 'src/app/app-models/types/window';

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

    public isFullscreen(): boolean {
        return document.fullscreenElement ? true : false;
    }

    public toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    public openFullscreen(): void {
        document.documentElement.requestFullscreen();
    }

    public closeFullscreen(): void {
        document.exitFullscreen();
    }

}
