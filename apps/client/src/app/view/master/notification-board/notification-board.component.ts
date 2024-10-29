import { Component, Input, OnInit } from '@angular/core';
import { Session } from 'src/app/classes/session';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';
import { EventService } from 'src/app/services/event-service/event.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NotificationData } from 'src/app/types/notification';
import { APIService } from 'src/app/services/api/api.service';
import { MediaService } from 'src/app/services/resources-service/resources.service';
import { ClientService } from 'src/app/services/client-service/client.service';
import { EnumResourceType } from 'src/app/app-models/enums/resources';
import { EnumActionType } from 'src/app/app-models/enums/action';

@Component({
    selector: 'app-notification-board',
    templateUrl: './notification-board.component.html',
    styleUrls: ['./notification-board.component.scss'],
    host: {
        class: 'p-8 pt-0',
    }
})
export class NotificationBoardComponent implements OnInit, DashboardSection {
    @Input() sessions: Session[] = [];
    @Input() target?: Session;
    @Input() disabled: boolean = false;

    public notif!: NotificationData;

    constructor(
        private notification: NotificationsService,
        private eventService: EventService,
        private api: APIService,
        private resourcesService: MediaService
    ) {}

    ngOnInit(): void {
        this.reset();
    }

    public reset() {
        this.notif = {
            title: '',
            message: '',
            icon: '',
            image: '',
            duration: 5000,
        };
    }

    public browseIcon() {
        this.resourcesService
            .browse(EnumResourceType.IMAGE, true)
            .then((image: any) => {
                if (!image) return;
                if (image.isBase64) this.notif.icon = image.href;
                else this.notif.icon = this.api.serverUrl + '/' + image.href;
            });
    }

    public preview() {
        this.notification.create(this.notif);
    }

    public send() {
        this.eventService.sendAction(this.target!.fool, {
            type: EnumActionType.NOTIFICATION,
            data: this.notif,
        });
    }

    public formatDurationSliderLabel(value: number): string {
        if (value > 10000) return '∞';
        return `${value / 1000}s`;
    }

    private get hasTargetNotificationsTurnedOn(): boolean {
        return !!this.target && !!this.target.fool.settings.notifications;
    }

    private get hasTargetBrowserPermission(): boolean {
        return (
            !!this.target &&
            !!this.target.fool.browser.permissions.notifications
        );
    }

    public get isDisabled(): boolean {
        return (
            this.disabled ||
            !this.target ||
            !this.hasTargetBrowserPermission ||
            (!ClientService.IS_ADMIN && !this.hasTargetNotificationsTurnedOn)
        );
    }

    public get displayAlert(): boolean {
        return (
            !!this.target &&
            (!this.hasTargetBrowserPermission ||
                (!ClientService.IS_ADMIN &&
                    !this.hasTargetNotificationsTurnedOn))
        );
    }
}
