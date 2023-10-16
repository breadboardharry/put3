import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket-service/websocket.service';
import { Fool } from 'src/app/classes/fool';
import { Subject } from 'rxjs';
import { Session } from 'src/app/classes/session';
import { Action, EnumEvent, EnumUserRole, Event, EventMessage, FoolInfos, LayoutData, ResourceSet, RoleResponseData, SessionAction, UserPreferences } from 'put3-models';
import { Layout } from 'src/app/types/layout';

@Injectable({
    providedIn: 'root',
})
export class EventService {

    public onSession: Subject<any> = new Subject<any>();
    public onRole: Subject<RoleResponseData> = new Subject<RoleResponseData>();
    public onAction: Subject<Action> = new Subject<Action>();
    public onLayout: Subject<LayoutData> = new Subject<LayoutData>();
    public onRename: Subject<string> = new Subject<string>();
    public onResourcesUpdate: Subject<ResourceSet> = new Subject<ResourceSet>();

    constructor(
        private websocket: WebSocketService
    ) {
        this.initSubscriptions();
    }

    private initSubscriptions() {
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
            console.log("[-] Action received", event.data);
            this.onAction.next(event.data);
        });

        this.websocket.socket.on(EnumEvent.LAYOUT, (event: EventMessage) => {
            console.log("[-] Layout received", event.data);
            this.onLayout.next(event.data);
        });

        this.websocket.socket.on(EnumEvent.RENAME, (event: EventMessage) => {
            console.log("[-] Rename received", event.data);
            this.onRename.next(event.data);
        });

        this.websocket.socket.on(EnumEvent.RESOURCES, (event: EventMessage) => {
            console.log("[-] Resources received", event.data);
            this.onResourcesUpdate.next(event.data);
        });

        this.websocket.socket.on(EnumEvent.SESSION, (event: any) => {
            console.log("[-] Session received", event.data);
            this.onSession.next(new Session(event.data));
        });
    }

    public sendSessionEvent(target: Session, action: SessionAction): void {
        this.emitEvent(new Event(EnumEvent.SESSION, {
            target: {
                session: target.code
            },
            data: action
        }));
    }

    public sendAction(target: Fool, action: Action): void {
        this.emitEvent(new Event(EnumEvent.ACTION, {
            target: {
                user: target.uuid
            },
            data: action
        }));
    }

    public sendLayout(target: Fool, layout: Layout): void {
        this.emitEvent(new Event(EnumEvent.LAYOUT, {
            target: {
                user: target.uuid
            },
            data: layout
        }));
    }

    public renameFool(target: Fool, newName: string): void {
        this.emitEvent(new Event(EnumEvent.RENAME, {
            target: {
                user: target.uuid
            },
            data: newName
        }));
    }

    public changeSelfRole(role: EnumUserRole, data: {sessionCode?: string, preferences?: UserPreferences}): void {
        this.emitEvent(new Event(EnumEvent.ROLE, {
            data: {
                role,
                preferences: data.preferences,
                sessionCode: data.sessionCode
            }
        }));
    }

    public changeSelfInfos(infos: Partial<FoolInfos>): void {
        this.emitEvent(new Event(EnumEvent.INFOS, {
            data: infos
        }));
    }

    private emitEvent(event: Event) {
        console.log("[-] Emitting event", event);
        console.log("[-] Emitting event", event.name);
        console.log("[-] Emitting event", event.getMessage());
        this.websocket.socket.emit(event.name, event.getMessage());
    }

}
