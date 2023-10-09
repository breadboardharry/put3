import { Injectable } from '@angular/core';
import { Layout } from 'src/app/types/layout';
import { HitboxService } from '../hitbox-service/hitbox.service';
import { PreferencesService } from '../preferences-service/preferences.service';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    constructor(private hitboxService: HitboxService, private preferences: PreferencesService) {}

    public newFoolLayout(layout: Layout) {
        // Instanciate hitboxes
        layout.hitboxes = this.hitboxService.instaciate(layout.hitboxes, true);

        // If an image is set, save it in cookies
        if ('image' in layout.desktop) this.preferences.setDesktop({
            image: layout.desktop.image!
        });

        return layout;
    }
}
