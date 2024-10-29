import { Injectable } from '@angular/core';
import { EventService } from '../event-service/event.service';
import { BrowserService } from '../utils/browser-service/browser.service';
import { WindowService } from '../window-service/window.service';
import { ClientService } from '../client-service/client.service';
import { LayoutService } from '../layout-service/layout.service';
import { AudioService } from '../audio-service/audio.service';
import { PreferencesService } from '../preferences-service/preferences.service';
import { Layout } from 'src/app/types/layout';
import { APIService } from '../api/api.service';
import { MicrophoneService } from '../microphone/microphone.service';
import { CameraService } from '../camera/camera.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationData } from 'src/app/types/notification';
import { EnumSessionStatus } from 'src/app/app-models/enums/session';
import {
    EnumActionType,
    EnumSessionActionType,
} from 'src/app/app-models/enums/action';
import { ActionData } from 'src/app/app-models/types/action';
import { toast } from 'ngx-sonner';

@Injectable({
    providedIn: 'root',
})
export class FoolService {
    public running: boolean = false;

    public audioEnabled: boolean = false;
    public notificationsEnabled: boolean = false;
    public microphoneEnabled: boolean = false;
    public cameraEnabled: boolean = false;

    public layout: Layout = {
        hitboxes: [],
        desktop: {
            image: undefined,
        },
    };

    constructor(
        private eventService: EventService,
        private api: APIService,
        private browser: BrowserService,
        private windowService: WindowService,
        private layoutService: LayoutService,
        private preferences: PreferencesService,
        private audio: AudioService,
        private microphone: MicrophoneService,
        private camera: CameraService,
        private notifications: NotificationsService
    ) {
        this.init();
    }

    private init() {
        this.eventService.onSession.subscribe((session) => {
            if (session.status != EnumSessionStatus.RUNNING) return;
            this.run();
        });

        this.eventService.onAction.subscribe((action) => {
            this.action(action.type, action.data!);
        });

        this.eventService.onLayout.subscribe((layout) => {
            this.layout = this.layoutService.newFoolLayout(layout);
        });

        this.eventService.onRename.subscribe((newName) => {
            this.preferences.setName(newName);
        });

        this.eventService.onMessage.subscribe((message) => {
            toast[message.type](message.text);
        });
    }

    public run() {
        if (this.running) return;
        this.running = true;
        this.eventService.sendSessionEvent(ClientService.SESSION_CODE!, {
            type: EnumSessionActionType.RUN,
        });
    }

    private action(type: EnumActionType, data: ActionData) {
        switch (type) {
            case EnumActionType.AUDIO:
                const volume = 'volume' in data ? data.volume : 1.0;
                if ('stop' in data && data.stop) this.audio.stopAll();
                else if ('track' in data)
                    this.audio.play(
                        this.api.serverUrl + '/' + data.track!.src,
                        volume
                    );
                break;

            case EnumActionType.NOTIFICATION:
                this.notifications.create(data as NotificationData);
                break;

            case EnumActionType.SHUTDOWN:
                this.browser.redirect('https://google.com');
                break;

            default:
                console.error('Unknown action type', data);
                break;
        }
    }

    public sendInfos() {
        this.eventService.changeSelfInfos({
            browser: {
                name: this.browser.get(),
                permissions: {
                    notifications: this.notifications.hasPermission,
                    audio: this.audio.canPlay,
                    microphone: this.microphone.hasPermission,
                    camera: this.camera.hasPermission,
                },
            },
            window: this.windowService.getWindowSize(),
            settings: {
                notifications: this.notificationsEnabled,
                audio: this.audioEnabled,
                microphone: this.microphoneEnabled,
                camera: this.cameraEnabled,
            },
        });
    }
}
