import { Injectable } from '@angular/core';
import { NotificationData } from 'src/app/types/notification';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    public hasPermission: boolean = false;

    constructor() { }

    public async askPermission() {
        const permission = await Notification.requestPermission();
        this.hasPermission = permission == 'granted';
        return this.hasPermission;
    }

    public async create(data: NotificationData, duration?: number): Promise<Notification | undefined> {
        if (!this.hasPermission) await this.askPermission();
        const notification = new Notification(data.title, {
            body: data.message,
            icon: data.icon,
            image: data.image,
        });
        if (duration) setTimeout(() => notification.close(), duration);
        return notification;
    }

}