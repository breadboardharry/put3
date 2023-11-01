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

    public async create(data: NotificationData): Promise<Notification | undefined> {
        if (!this.hasPermission) await this.askPermission();
        const notification = new Notification(data.title, {
            body: data.message,
            icon: data.icon,
            image: data.image,
            requireInteraction: !!data.duration && data.duration > 10000,
        });
        if (data.duration) setTimeout(() => {
            notification.close()
        }, data.duration);
        return notification;
    }

}