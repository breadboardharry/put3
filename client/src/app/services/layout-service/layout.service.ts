import { Injectable } from '@angular/core';
import { HitboxService } from '../hitbox-service/hitbox.service';
import { PreferencesService } from '../preferences-service/preferences.service';
import { LayoutData } from 'put3-models';
import { Layout } from 'src/app/types/layout';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    constructor(
        private hitboxService: HitboxService,
        private preferences: PreferencesService
    ) {}

    public newFoolLayout(layout: LayoutData) {
        const instaciatedLayout: Layout = {...layout as any};
        // Instanciate hitboxes
        instaciatedLayout.hitboxes = this.hitboxService.instaciate(layout.hitboxes, true);
        // If an image is set, save it in cookies
        if ('image' in instaciatedLayout.desktop) this.preferences.setDesktop({
            image: instaciatedLayout.desktop.image!
        });

        return instaciatedLayout;
    }
}
