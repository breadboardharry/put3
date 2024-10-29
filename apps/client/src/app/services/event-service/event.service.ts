import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket-service/websocket.service';
import { Fool } from 'src/app/classes/fool';
import { Subject } from 'rxjs';
import { Session } from 'src/app/classes/session';
import { Layout } from 'src/app/types/layout';
import { Action, SessionAction } from 'src/app/app-models/types/action';
import { EventMessage, EventMessageData } from 'src/app/app-models/types/event';
import { EnumEvent } from 'src/app/app-models/enums/event';
import { EnumUserRole } from 'src/app/app-models/enums/user';
import { FoolInfos } from 'src/app/app-models/types/fool';
import { ResourceSet } from 'src/app/app-models/types/resources';
import { LayoutData } from 'src/app/app-models/types/layout';
import { RoleResponseData } from 'src/app/app-models/types/role';
import { UserPreferences } from 'src/app/app-models/types/preferences';
import { Event } from 'src/app/app-models/classes/event';
import { Media, RemoteMedia } from 'src/app/providers/media';

@Injectable({
    providedIn: 'root',
})
export class EventService {
    public onSession: Subject<any> = new Subject<any>();
    public onRole: Subject<RoleResponseData> = new Subject<RoleResponseData>();
    public onAction: Subject<Action> = new Subject<Action>();
    public onLayout: Subject<LayoutData> = new Subject<LayoutData>();
    public onRename: Subject<string> = new Subject<string>();
    public onResourcesUpdate: Subject<ResourceSet<RemoteMedia>> = new Subject<
        ResourceSet<RemoteMedia>
    >();
    public onMessage: Subject<EventMessageData> =
        new Subject<EventMessageData>();

    constructor(private websocket: WebSocketService) {
        this.initSubscriptions();
    }

    private initSubscriptions() {
        console.log('[-] EventService initSubscriptions');
        console.log('[-] EnumEvent', EnumEvent);
        console.log('[-] EnumUserRole', EnumUserRole);
        this.websocket.socket.on(EnumEvent.ROLE, (event: EventMessage) => {
            // Get the UUID of this client only once
            const data = event.data as RoleResponseData;
            this.onRole.next({
                uuid: data.uuid!,
                name: data.name!,
                role: data.role,
                sessionCode: data.sessionCode!,
            });
            this.websocket.socket.off(EnumEvent.ROLE);
        });

        this.websocket.socket.on(EnumEvent.ACTION, (event: EventMessage) => {
            console.log('[-] Action received', event.data);
            this.onAction.next(event.data);
        });

        this.websocket.socket.on(EnumEvent.LAYOUT, (event: EventMessage) => {
            console.log('[-] Layout received', event.data);
            this.onLayout.next(event.data);
        });

        this.websocket.socket.on(EnumEvent.RENAME, (event: EventMessage) => {
            console.log('[-] Rename received', event.data);
            this.onRename.next(event.data);
        });

        this.websocket.socket.on(EnumEvent.RESOURCES, (event: EventMessage) => {
            console.log('[-] Resources received', event.data);
            this.onResourcesUpdate.next(event.data);
        });

        this.websocket.socket.on(EnumEvent.SESSION, (event: EventMessage) => {
            console.log('[-] Session received', event.data);
            this.onSession.next(new Session(event.data));
        });

        this.websocket.socket.on(EnumEvent.MESSAGE, (event: EventMessage) => {
            console.log('[-] Message received', event.data);
            this.onMessage.next(event.data);
        });
    }

    public sendSessionEvent(code: string, action: SessionAction): void {
        this.emitEvent(
            new Event(EnumEvent.SESSION, {
                target: {
                    session: code,
                },
                data: action,
            })
        );
    }

    public sendAction(target: Fool, action: Action): void {
        const actionData = action.data;
        // Remove "resourcesService" from track in action.data
        if (actionData?.track) {
            const { resourcesService, ...track } = actionData.track;
            actionData.track = track as any;
        }

        this.emitEvent(
            new Event(EnumEvent.ACTION, {
                target: {
                    user: target.uuid,
                },
                data: {
                    type: action.type,
                    data: actionData,
                },
            })
        );
    }

    public sendLayout(target: Fool, layout: Layout): void {
        this.emitEvent(
            new Event(EnumEvent.LAYOUT, {
                target: {
                    user: target.uuid,
                },
                data: {
                    desktop: layout.desktop,
                    hitboxes: layout.hitboxes.map((hitbox) => {
                        for (const key in hitbox.events) {
                            const eventData = hitbox.events[key].data;
                            if (!eventData || !eventData.track) continue;
                            const { resourcesService, ...track } = {
                                ...eventData,
                            }.track;
                            eventData.track = track;
                        }
                        return hitbox;
                    }),
                },
            })
        );
    }

    public renameFool(target: Fool, newName: string): void {
        this.emitEvent(
            new Event(EnumEvent.RENAME, {
                target: {
                    user: target.uuid,
                },
                data: newName,
            })
        );
    }

    public changeSelfRole(
        role: EnumUserRole,
        data: { sessionCode?: string; preferences?: UserPreferences }
    ): void {
        this.emitEvent(
            new Event(EnumEvent.ROLE, {
                data: {
                    role,
                    preferences: data.preferences,
                    sessionCode: data.sessionCode,
                },
            })
        );
    }

    public changeSelfInfos(infos: Partial<FoolInfos>): void {
        this.emitEvent(
            new Event(EnumEvent.INFOS, {
                data: infos,
            })
        );
    }

    private emitEvent(event: Event) {
        this.websocket.socket.emit(event.name, event.getMessage());
    }
}
