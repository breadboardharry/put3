import { Injectable } from '@angular/core';
import { EnumEventName } from 'src/app/enums/event-name';
import { EventUuidDTO } from 'src/app/models/dtos/events/uuid.dto';
import { EventService } from '../event-service/event.service';
import { EnumUserRole } from 'src/app/enums/role';

@Injectable({
    providedIn: 'root',
})
export class ClientService {

    public static UUID: string;
    public static ROLE: EnumUserRole;

    constructor(
        private eventService: EventService
    ) {
        this.initSubscriptions();
    }

    private initSubscriptions() {
        this.eventService.onUuid.subscribe((uuid: string) => {
            console.log(`UUID: ${uuid}`);
            ClientService.UUID = uuid;
        });
    }

    public setRole(role: EnumUserRole, preferences: {} = {}) {
        ClientService.ROLE = role;
        this.eventService.changeSelfRole(role, preferences);
    }

}
