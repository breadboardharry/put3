import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DesktopPreference, UserPreferences } from 'src/app/app-models/types/preferences';

@Injectable({
    providedIn: 'root',
})
export class PreferencesService {

    constructor(private cookie: CookieService) {}

    public get(): UserPreferences {
        return {
            name: this.getName(),
            desktop: this.getDesktop()
        };
    }

    /**
     * Set the fool desktop preferences
     * @param preferences Desktop preferences
     */
    public setDesktop(preferences: DesktopPreference): void {
        this.cookie.set('desktop', JSON.stringify(preferences), undefined, '/');
    }

    /**
     * Get the fool desktop preferences
     * @returns Desktop preferences or null
     */
    public getDesktop(): DesktopPreference | undefined {
        const desktop = this.cookie.get('desktop');
        return desktop ? JSON.parse(desktop) : undefined;
    }

    /**
     * Set name
     * @param name Name
     */
    public setName(name: string): void {
        this.cookie.set('name', JSON.stringify(name || ''), undefined, '/');
    }

    /**
     * Get name
     * @returns Name or null
     */
    public getName(): string | undefined {
        const name = this.cookie.get('name');
        return name ? JSON.parse(name) : undefined;
    }

}
