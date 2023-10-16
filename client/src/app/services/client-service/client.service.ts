import { Injectable } from '@angular/core';
import { EventService, RoleResponseData } from '../event-service/event.service';
import { EnumUserRole } from 'src/app/enums/role';
import { UserPreferences } from 'src/app/types/preferences/user-preferences';
import { Subject } from 'rxjs';

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
            console.log("[-] Role accepted", data);
            ClientService.UUID = data.uuid;
            ClientService.ROLE = data.role;
            ClientService.NAME = data.name;
            ClientService.SESSION_CODE = data.sessionCode;

            this.roleChanged.next({ uuid: data.uuid, role: data.role, name: data.name, sessionCode: data.sessionCode });
        });
    }

    public askForRole(role: EnumUserRole, data: {sessionCode?: string, preferences?: UserPreferences}) {
        this.eventService.changeSelfRole(role, data);
    }

    public roleChanged: Subject<{ uuid: string, role: EnumUserRole, name: string, sessionCode?: string }> = new Subject();

}
