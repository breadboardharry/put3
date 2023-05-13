import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DesktopPreference } from 'src/app/types/preferences/desktop';

@Injectable({
    providedIn: 'root',
})
export class PreferencesService {

    constructor(private cookie: CookieService) {}

    public get() {
        console.log({
            desktop: this.getDesktop(),
            name: this.getName()
        });
        return {
            desktop: this.getDesktop(),
            name: this.getName()
        };
    }

    /**
     * Set the fool desktop preferences
     * @param preferences Desktop preferences
     */
    public setDesktop (preferences: DesktopPreference): void {
        this.cookie.set('desktop', JSON.stringify(preferences));
    }

    /**
     * Get the fool desktop preferences
     * @returns Desktop preferences or null
     */
    public getDesktop (): DesktopPreference | null {
        const desktop = this.cookie.get('desktop');
        return desktop ? JSON.parse(desktop) : null;
    }

    /**
     * Set name
     * @param name Name
     */
    public setName (name: string): void {
        this.cookie.set('name', JSON.stringify(name));
    }

    /**
     * Get name
     * @returns Name or null
     */
    public getName (): string | null {
        const name = this.cookie.get('name');
        return name ? JSON.parse(name) : null;
    }
}
