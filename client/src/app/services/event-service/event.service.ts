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
import { ClientService } from '../client-service/client.service';
import { EventUpdateDTO } from 'src/app/models/dtos/events/update.dto';
import { ResourceSet } from 'src/app/types/resources/data-set';
import { EnumUpdateType } from 'src/app/enums/type-update';
import { Action } from 'src/app/types/action';
import { EventUuidDTO } from 'src/app/models/dtos/events/uuid.dto';

@Injectable({
    providedIn: 'root',
})
export class EventService {

    public onUuid: Subject<string> = new Subject<string>();
    public onAction: Subject<Action> = new Subject<Action>();
    public onLayout: Subject<Layout> = new Subject<Layout>();
    public onRename: Subject<string> = new Subject<string>();
    public onResourcesUpdate: Subject<ResourceSet> = new Subject<ResourceSet>();
    public onFoolsUpdate: Subject<any[]> = new Subject<any[]>();

    constructor(
        private websocket: WebSocketService
    ) {
        this.initSubscriptions();
    }

    private initSubscriptions() {
        this.websocket.socket.on(EnumEventName.UUID, (event: EventUuidDTO) => {
            // Get the UUID of this client only once
            this.onUuid.next(event.data);
            this.websocket.socket.off(EnumEventName.UUID);
        });

        this.websocket.socket.on(EnumEventName.ACTION, (event: EventActionDTO) => {
            // Check if this user is the target
            if (event.target.uuid !== ClientService.UUID) return;
            this.onAction.next(event.data);
        });

        this.websocket.socket.on(EnumEventName.LAYOUT, (event: EventLayoutDTO) => {
            // Check if this user is the target
            if (event.target.uuid !== ClientService.UUID) return;
            this.onLayout.next(event.data);
        });

        this.websocket.socket.on(EnumEventName.RENAME, (event: EventRenameDTO) => {
            // Check if this user is the target
            if (event.target.uuid !== ClientService.UUID) return;
            this.onRename.next(event.data);
        });

        this.websocket.socket.on(EnumEventName.UPDATE, (event: EventUpdateDTO) => {
            if (event.data.type == EnumUpdateType.RESOURCES) {
                this.onResourcesUpdate.next(event.data.value as ResourceSet);
            }
            if (event.data.type == EnumUpdateType.FOOLS) {
                this.onFoolsUpdate.next(event.data.value as any[]);
            }
        });
    }

    public sendAction(target: Fool, action: Action): void {
        const dto = plainToClass(EventActionDTO, { target, data: action });
        this.websocket.socket.emit(EnumEventName.ACTION, dto);
    }

    public sendLayout(target: Fool, layout: Layout): void {
        const dto = plainToClass(EventLayoutDTO, { target, data: layout });
        this.websocket.socket.emit(EnumEventName.LAYOUT, dto);
    }

    public renameFool(target: Fool, newName: string): void {
        const dto = plainToClass(EventRenameDTO, { target, data: { newName }});
        this.websocket.socket.emit(EnumEventName.RENAME, dto);
    }

    public changeSelfRole(role: EnumUserRole, preferences?: { [key: string]: any }): void {
        const dto = plainToClass(EventRoleDTO, { data: { role, preferences }});
        this.websocket.socket.emit(EnumEventName.ROLE, dto);
    }

    public changeSelfInfos(infos: Partial<FoolInfos>): void {
        const dto = plainToClass(EventInfosDTO, { data: infos });
        this.websocket.socket.emit(EnumEventName.INFOS, dto);
    }

}
