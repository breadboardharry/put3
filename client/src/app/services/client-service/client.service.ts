import { Injectable } from '@angular/core';
import { EventService, RoleResponseData } from '../event-service/event.service';
import { EnumUserRole } from 'src/app/enums/role';
import { UserPreferences } from 'src/app/types/preferences/user-preferences';

@Injectable({
    providedIn: 'root',
})
export class ClientService {

    public static UUID: string;
    public static ROLE: EnumUserRole;
    public static NAME: string;
    public static SESSION_CODE?: string;

    constructor(
        private eventService: EventService
    ) {
        this.initSubscriptions();
    }

    private initSubscriptions() {
        this.eventService.onRole.subscribe((data: RoleResponseData) => {
            console.log("Role accepted", data);
            ClientService.UUID = data.uuid;
            ClientService.ROLE = data.role;
            ClientService.NAME = data.name;
            ClientService.SESSION_CODE = data.sessionCode;
        });
    }

    public askForRole(role: EnumUserRole, preferences?: UserPreferences) {
        this.eventService.changeSelfRole(role, preferences);
    }

}
