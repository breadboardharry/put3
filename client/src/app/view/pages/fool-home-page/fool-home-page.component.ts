import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActionData, EnumActionType, EnumSessionStatus, EnumUserRole } from 'put3-models';
import { AudioService } from 'src/app/services/audio-service/audio.service';
import { environment } from 'src/environments/environment';
import { WindowService } from 'src/app/services/window-service/window.service';
import { PreferencesService } from 'src/app/services/preferences-service/preferences.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { LayoutService } from 'src/app/services/layout-service/layout.service';
import { BrowserService } from 'src/app/services/utils/browser-service/browser.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { EventService } from 'src/app/services/event-service/event.service';
import { ClientService } from 'src/app/services/client-service/client.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';
import { Layout } from 'src/app/types/layout';

@Component({
  selector: 'app-fool-home-page',
  templateUrl: './fool-home-page.component.html',
  styleUrls: ['./fool-home-page.component.scss']
})
export class FoolHomePageComponent implements OnInit, OnDestroy {

    public loading = true;
    public running = false;

    public layout: Layout = {
        hitboxes: [],
        desktop: {
            image: undefined
        }
    };
    private defaultDesktopImage = environment.defaultDesktopImage;
    public WindowService = WindowService;

    private subscriptions: { [key: string]: any } = {};

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

    ngOnInit() {
        if (ClientService.ROLE === EnumUserRole.MASTER) return window.location.reload();
        if (ClientService.ROLE === EnumUserRole.FOOL) return this.init();

        this.subscriptions['roleChanged'] = this.clientService.roleChanged.subscribe(() => {
            this.init();
        });
        this.clientService.askForRole(EnumUserRole.FOOL, {preferences: this.preferences.get()});
    }

    ngOnDestroy(): void {
        Object.keys(this.subscriptions).forEach((key) => {
            this.subscriptions[key].unsubscribe();
        });
    }

    private init(): void {
        this.loading = false;
        this.subscriptions['onSession'] = this.eventService.onSession.subscribe((session) => {
            if (!this.running && session.status == EnumSessionStatus.RUNNING) {
                this.run();
            }
        });

        this.eventService.changeSelfInfos({
            browser: this.browser.get(),
            window: this.windowService.getWindowSize(),
        });

        this.subscriptions['onAction'] = this.eventService.onAction.subscribe((action) => {
            this.action(action.type, action.data!);
        });

        this.subscriptions['onLayout'] = this.eventService.onLayout.subscribe((layout) => {
            this.layout = this.layoutService.newFoolLayout(layout);
        });

        this.subscriptions['onRename'] = this.eventService.onRename.subscribe((newName) => {
            this.preferences.setName(newName);
        });

        this.subscriptions['onMessage'] = this.eventService.onMessage.subscribe((message) => {
            this.snackbar.open(message.type, message.text);
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

    private action(type: EnumActionType, data: ActionData) {
        switch (type) {
            case 'audio':
                const volume = 'volume' in data ? data.volume : 1.0;
                if ('stop' in data && data.stop) this.audio.stopAll();
                else if ('track' in data) this.audio.play(this.backend.serverUrl + '/' + data.track!.href, volume);
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
    private onRightClick(event: any) {
        event.preventDefault();
    }

    private timeout?: NodeJS.Timeout;
    @HostListener('window:resize', ['$event'])
    private onResize(event: any) {
        // Send window size to server
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.eventService.changeSelfInfos({
                window: this.windowService.getWindowSize()
            });
        }, 500);
    }
}
