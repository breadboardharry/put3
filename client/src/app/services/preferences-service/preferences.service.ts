import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DesktopPreference } from 'src/app/types/preferences/desktop';

@Injectable({
    providedIn: 'root',
})
export class PreferencesService {

    constructor(private cookie: CookieService) {}

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
}
