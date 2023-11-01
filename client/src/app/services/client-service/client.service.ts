import { Injectable } from '@angular/core';
import { EventService } from '../event-service/event.service';
import { Subject } from 'rxjs';
import { PreferencesService } from '../preferences-service/preferences.service';
import { AdminService } from '../admin-service/admin.service';
import { EnumUserRole } from 'src/app/app-models/enums/user';
import { RoleResponseData } from 'src/app/app-models/types/role';
import { UserPreferences } from 'src/app/app-models/types/preferences';

@Injectable({
    providedIn: 'root',
})
export class ClientService {

    public static UUID: string;
    public static ROLE: EnumUserRole;
    public static NAME: string;
    public static SESSION_CODE?: string;
    public static IS_ADMIN: boolean = false;

    constructor(
        private eventService: EventService,
        private preferences: PreferencesService,
        private adminService: AdminService,
    ) { }

    public async init() {
        this.initSubscriptions();
        const isAdmin = await this.adminService.isLogged();
        ClientService.IS_ADMIN = isAdmin;
    }

    private initSubscriptions() {
        this.eventService.onRole.subscribe((data: RoleResponseData) => {
            console.log("[-] Role accepted", data);
            ClientService.UUID = data.uuid;
            ClientService.ROLE = data.role;
            ClientService.NAME = data.name;
            ClientService.SESSION_CODE = data.sessionCode;

            this.preferences.setName(data.name);
            this.roleChanged.next({ uuid: data.uuid, role: data.role, name: data.name, sessionCode: data.sessionCode });
        });
    }

    public askForRole(role: EnumUserRole, data: {sessionCode?: string, preferences?: UserPreferences}) {
        this.eventService.changeSelfRole(role, data);
    }

    public roleChanged: Subject<{ uuid: string, role: EnumUserRole, name: string, sessionCode?: string }> = new Subject();

}
