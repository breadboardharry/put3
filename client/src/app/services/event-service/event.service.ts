import { Injectable } from '@angular/core';
import { EventRenameDTO } from 'src/app/models/dtos/events/rename.dto';
import { WebSocketService } from '../websocket-service/websocket.service';
import { EnumEventName } from 'src/app/enums/event-name';
import { plainToClass } from 'class-transformer';
import { Fool } from 'src/app/classes/fool';
import { EventActionDTO } from 'src/app/models/dtos/events/action.dto';
import { Layout } from 'src/app/types/layout';
import { EventLayoutDTO } from 'src/app/models/dtos/events/layout.dto';
import { EnumUserRole } from 'src/app/enums/role';
import { EventRoleDTO } from 'src/app/models/dtos/events/role.dto';
import { FoolInfos } from 'src/app/types/fool-infos';
import { EventInfosDTO } from 'src/app/models/dtos/events/infos.dto';
import { Subject } from 'rxjs';
import { EventResourcesDTO } from 'src/app/models/dtos/events/resources.dto';
import { ResourceSet } from 'src/app/types/resources/data-set';
import { Action } from 'src/app/types/action';
import { UserPreferences } from 'src/app/types/preferences/user-preferences';
import { Session } from 'src/app/classes/session';

export type RoleRequestData = {
    role: EnumUserRole;
    sessionCode?: string;
    preferences?: UserPreferences;
};

export type RoleResponseData = {
    uuid: string;
    name: string;
    role: EnumUserRole;
    sessionCode?: string;
};

@Injectable({
    providedIn: 'root',
})
export class EventService {

    public onSession: Subject<any> = new Subject<any>();
    public onRole: Subject<RoleResponseData> = new Subject<RoleResponseData>();
    public onAction: Subject<Action> = new Subject<Action>();
    public onLayout: Subject<Layout> = new Subject<Layout>();
    public onRename: Subject<string> = new Subject<string>();
    public onResourcesUpdate: Subject<ResourceSet> = new Subject<ResourceSet>();

    constructor(
        private websocket: WebSocketService
    ) {
        this.initSubscriptions();
    }

    private initSubscriptions() {
        this.websocket.socket.on(EnumEventName.ROLE, (event: EventRoleDTO) => {
            // Get the UUID of this client only once
            const data = event.data as RoleResponseData;
            this.onRole.next({
                uuid: data.uuid!,
                name: data.name!,
                role: data.role,
                sessionCode: data.sessionCode!,
            });
            this.websocket.socket.off(EnumEventName.ROLE);
        });

        this.websocket.socket.on(EnumEventName.ACTION, (event: EventActionDTO) => {
            this.onAction.next(event.data);
        });

        this.websocket.socket.on(EnumEventName.LAYOUT, (event: EventLayoutDTO) => {
            this.onLayout.next(event.data);
        });

        this.websocket.socket.on(EnumEventName.RENAME, (event: EventRenameDTO) => {
            this.onRename.next(event.data);
        });

        this.websocket.socket.on(EnumEventName.RESOURCES, (event: EventResourcesDTO) => {
            this.onResourcesUpdate.next(event.data);
        });

        this.websocket.socket.on(EnumEventName.SESSION, (event: any) => {
            this.onSession.next(new Session(event.data));
        });
    }

    public sendAction(target: Fool, action: Action): void {
        const dto = plainToClass(EventActionDTO, { target, data: action });
        this.websocket.socket.emit(EnumEventName.ACTION, dto);
    }

    public sendLayout(target: Fool, layout: Layout): void {
        const dto = plainToClass(EventLayoutDTO, { target: target, data: layout });
        this.websocket.socket.emit(EnumEventName.LAYOUT, dto);
    }

    public renameFool(target: Fool, newName: string): void {
        const dto = plainToClass(EventRenameDTO, { target, data: { newName }});
        this.websocket.socket.emit(EnumEventName.RENAME, dto);
    }

    public changeSelfRole(role: EnumUserRole, data: {sessionCode?: string, preferences?: UserPreferences}): void {
        const dto = plainToClass(EventRoleDTO, { data: {
            role,
            preferences: data.preferences,
            sessionCode: data.sessionCode
        }});
        this.websocket.socket.emit(EnumEventName.ROLE, dto);
    }

    public changeSelfInfos(infos: Partial<FoolInfos>): void {
        const dto = plainToClass(EventInfosDTO, { data: infos });
        this.websocket.socket.emit(EnumEventName.INFOS, dto);
    }

}
