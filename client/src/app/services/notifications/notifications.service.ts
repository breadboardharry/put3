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
        return permission;
    }

    public async create(data: NotificationData, duration?: number): Promise<Notification | undefined> {
        if (!this.hasPermission) await this.askPermission();
        console.log('create', data);
        const notification = new Notification(data.title, {
            body: data.message,
            icon: data.icon,
            image: data.image,
        });
        return notification;
    }

}
