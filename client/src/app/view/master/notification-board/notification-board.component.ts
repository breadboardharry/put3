import { Component, Input, OnInit } from '@angular/core';
import { Session } from 'src/app/classes/session';
import { EnumActionType, EnumResourceType } from 'put3-models';
import { DashboardSection } from 'src/app/interfaces/dashboard-section';
import { EventService } from 'src/app/services/event-service/event.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NotificationData } from 'src/app/types/notification';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ResourcesService } from 'src/app/services/resources-service/resources.service';
import { AdminService } from 'src/app/services/admin-service/admin.service';

@Component({
    selector: 'app-notification-board',
    templateUrl: './notification-board.component.html',
    styleUrls: ['./notification-board.component.scss']
})
export class NotificationBoardComponent implements OnInit, DashboardSection {

    @Input() sessions: Session[] = [];
    @Input() target?: Session;
    @Input() disabled: boolean = false;

    public notif!: NotificationData;
    public isAdmin: boolean = false;

    constructor(
        private notification: NotificationsService,
        private eventService: EventService,
        private backend: BackendService,
        private resourcesService: ResourcesService,
        private adminService: AdminService,
    ) { }

    ngOnInit(): void {
        this.adminService.isLogged().then((isAdmin: boolean) => {
            this.isAdmin = isAdmin;
        });
        this.reset();
    }

    public reset() {
        this.notif = {
            title: '',
            message: '',
            icon: '',
            image: '',
            duration: 5,
        }
    }

    public importIcon() {
        console.log('importIcon');
    }

    public browseIcon() {
        this.resourcesService.browse(EnumResourceType.IMAGE).then((image: any) => {
            if (!image) return;
            this.notif.icon = this.backend.serverUrl + '/' + image.href;
        });
    }

    public test() {
        this.notification.create(this.notif);
    }

    public send() {
        this.eventService.sendAction(this.target!.fool, {
                type: EnumActionType.NOTIFICATION,
                data: this.notif
            }
        );
    }

    public formatDurationSliderLabel(value: number): string {
        if (value > 10) return '∞';
        return `${value}s`;
    }

    private get hasTargetNotificationsTurnedOn(): boolean {
        return !!this.target && !!this.target.fool.settings.notifications;
    }

    private get hasTargetBrowserPermission(): boolean {
        return !!this.target && !!this.target.fool.browser.permissions.notifications;
    }

    public get isDisabled(): boolean {
        return this.disabled || !this.target || !this.hasTargetBrowserPermission || (
            !this.isAdmin && !this.hasTargetNotificationsTurnedOn
        );
    }

    public get displayAlert(): boolean {
        return !!this.target && (!this.hasTargetBrowserPermission ||
            (!this.isAdmin && !this.hasTargetNotificationsTurnedOn)
        );
    }

}
