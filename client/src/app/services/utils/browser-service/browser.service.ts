import { Injectable } from '@angular/core';
import { Browser } from 'src/app/enums/browser';

@Injectable({
    providedIn: 'root',
})
export class BrowserService {

    constructor() {}

    /**
     * Returns the browser
     * @returns {Browser} Browser
     * @see https://www.positronx.io/angular-detect-browser-name-and-version-tutorial-example/
     */
    public get(): Browser {
        const agent = window.navigator.userAgent.toLowerCase();

        switch (true) {
            case agent.indexOf('edg') > -1:
            case agent.indexOf('edge') > -1: return Browser.Edge;

            case agent.indexOf('opr') > -1 && !!(<any>window).opr: return Browser.Opera;

            case agent.indexOf('chrome') > -1 && !!(<any>window).chrome: return Browser.Chrome;

            case agent.indexOf('firefox') > -1: return Browser.Firefox;

            case agent.indexOf('safari') > -1: return Browser.Safari;

            case agent.indexOf('trident') > -1: return Browser.IE;

            default: return Browser.Other;
        }
    }

    /**
     * Returns the browser icon
     * @returns {string} Browser icon
     */
    public get icon(): string {
        const browser = this.get();
        return this.toIcon(browser);
    }

    /**
     * Returns the icon of a browser passed in parameter
     * @param {Browser} browser Browser
     * @returns {string} Browser icon
     */
    public toIcon(browser: Browser): string {
        const dir = "assets/icons/browsers/";

        if (!browser || browser === Browser.Other || browser === Browser.IE) return '';
        return dir + browser + '.png';
    }
}
