import { Component, HostListener, OnInit } from '@angular/core';
import { CursorService } from 'src/app/services/cursor-service/cursor.service';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { environment } from 'src/environments/environment';
import { WindowService } from 'src/app/services/window-service/window.service';
import { PreferencesService } from 'src/app/services/preferences-service/preferences.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { Layout } from 'src/app/types/layout';
import { LayoutService } from 'src/app/services/layout-service/layout.service';
import { BrowserService } from 'src/app/services/utils/browser-service/browser.service';
import { EnumUserRole } from 'src/app/enums/role';
import { BackendService } from 'src/app/services/backend/backend.service';
import { EventService } from 'src/app/services/event-service/event.service';
import { ClientService } from 'src/app/services/client-service/client.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';

@Component({
  selector: 'app-fool-home-page',
  templateUrl: './fool-home-page.component.html',
  styleUrls: ['./fool-home-page.component.scss']
})
export class FoolHomePageComponent implements OnInit {

    public loading = true;
    public running = false;

    public layout: Layout = {
        hitboxes: [],
        desktop: {
            image: undefined
        }
    };
    private defaultDesktopImage = environment.defaultDesktopImage;

    constructor(
        private clientService: ClientService,
        private backend: BackendService,
        private browser: BrowserService,
        private layoutService: LayoutService,
        private resourceService: ResourcesService,
        private preferences: PreferencesService,
        private windowService: WindowService,
        private audio: AudioService,
        private eventService: EventService,
        private snackbar: SnackbarService
    ) {}

    ngOnInit(): void {
        this.clientService.roleChanged.subscribe(() => {
            this.init();
            this.loading = false;
        });
        this.clientService.askForRole(EnumUserRole.FOOL, {preferences: this.preferences.get()});
    }

    private init(): void {
        this.eventService.onSession.subscribe((session) => {
            console.log("Session message", session);
            if (!this.running) this.run();
        });

        this.eventService.changeSelfInfos({
            browser: this.browser.get(),
            window: this.windowService.getWindowSize(),
        });

        this.eventService.onAction.subscribe((data) => {
            this.action(data);
        });

        this.eventService.onLayout.subscribe((data) => {
            this.layout = this.layoutService.newFoolLayout(data);
        });

        this.eventService.onRename.subscribe((newName) => {
            this.preferences.setName(newName);
        });

        this.setDesktopImage();
    }

    async setDesktopImage() {
        // Check in cookies if there a previous desktop image is set
        const prevDesktop: any = this.preferences.getDesktop();

        if (!prevDesktop) return;

        // Check if the image still exists
        const exists = await this.resourceService.exists(prevDesktop.image);
        if (!exists) return;

        this.layout.desktop.image = prevDesktop.image;
        return;
    }

    public run(): void {
        this.running = true;
    }

    action(data: { [key: string]: any }) {
        switch (data['type']) {
            case 'audio':
                const volume = 'volume' in data ? data['volume'] : 1.0;
                if ('stop' in data && data['stop']) this.audio.stopAll();
                else if ('track' in data) this.audio.play(this.backend.serverUrl + '/' + data['track'].href, volume);
                break;

            default:
                console.error('Unknown action type', data);
                break;
        }
    }

    public get sessionCode(): string {
        return ClientService.SESSION_CODE || "";
    }

    public get masterUrl(): string {
        return window.location.origin + '/master?code=' + this.sessionCode;
    }

    public get backgroundImage(): string {
        return this.backend.serverUrl + '/' + (this.layout.desktop.image ? this.layout.desktop.image : this.defaultDesktopImage);
    }

    public copiedToClipboard(): void {
        this.snackbar.openSuccess("Code copied to clipboard");
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: any) {
        event.preventDefault();
    }

    private timeout: NodeJS.Timeout | undefined;
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        // Send window size to server
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.eventService.changeSelfInfos({
                window: this.windowService.getWindowSize()
            });
        }, 500);
    }
}
