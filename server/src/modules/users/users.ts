import { EnumUserRole } from "../../enums/role";
import UsersService from "../../services/users.service";
import { Subject } from "rxjs";
import { getData } from "../resources/resources";
import { APIResponse } from "../../types/response";
import { EnumUpdateType } from "../../enums/update-type";
import { UserPreferences } from "../../types/user-preferences";
import { EnumEventName } from "../../enums/event-name";
import { SessionService } from "../../services/sessions.service";
import { SessionModule } from "../session/sessions";
import { EmitParams } from "../socket-server/socket-server";

export class UserModule {

    public static emitSubject: Subject<EmitParams> = new Subject<EmitParams>();

    private static emit(key: string, data?: any, targetUuids?: string[]) {
        const params: EmitParams = { key, targetIds: targetUuids, data: {data} };
        this.emitSubject.next(params);
    }

    public static connect(uuid: string): APIResponse {
        console.log("[-] New user connected: " + uuid);
        return { success: true };
    }

    public static disconnect(uuid: string): APIResponse {
        console.log("[-] try disconnection: " + uuid);
        const checkUuid = this.checkUuid(uuid, true);
        if (!checkUuid.success) {
            console.error(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] User disconnected: " + uuid);
        const user = UsersService.get(uuid);

        SessionModule.disconnect(user!);
        UsersService.remove(uuid);
        this.emitUpdate.fools();

        return { success: true, message: "User deleted" };
    }

    public static setRole(uuid: string, role: string, data: { sessionCode?: string, preferences?: UserPreferences }): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.error(checkUuid.message);
            return checkUuid;
        }

        const checkRole = this.checkRole(role);
        if (!checkRole.success) {
            console.error(checkRole.message);
            return checkRole;
        }

        console.log("[-] User " + uuid + " selected role " + role);

        const user = UsersService.get(uuid);
        if (user) {
            // TODO
            console.log("[-] User " + uuid + " already exists");
        }
        else {

            if (role == EnumUserRole.MASTER) {
                if (!SessionService.find(data.sessionCode!)) {
                    return { success: false, message: "Session doesn't exist" };
                }
            }

            const user = UsersService.new(uuid, role as EnumUserRole, data.preferences);
            if (role == EnumUserRole.FOOL) {
                const session = SessionService.new(user);
                this.emit(EnumEventName.ROLE, {
                    uuid: user.uuid,
                    name: user.name,
                    role: user.role,
                    sessionCode: session.getCode(),
                }, [uuid]);
            }
            else if (role == EnumUserRole.MASTER) {
                this.emit(EnumEventName.ROLE, {
                    uuid: user.uuid,
                    name: user.name,
                    role: user.role,
                }, [uuid]);
                SessionModule.connect(user, data.sessionCode!);
            }
        }

        this.emitUpdate.fools();

        return { success: true, message: "Role changed" };
    }

    public static sendAction(uuid: string, action: any): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.error(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] Action sent to " + uuid);
        this.emit(EnumEventName.ACTION, action, [uuid]);

        return { success: true, message: "Action sent" };
    }

    public static changeInfos(uuid: string, infos: any): APIResponse {
        const checkUuid = this.checkUuid(uuid, true);
        if (!checkUuid.success) {
            console.error(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] Infos changed for " + uuid);
        const user = UsersService.get(uuid)!;
        user.infos = {...user.infos, ...infos};
        this.emitUpdate.fools();

        return { success: true, message: "Infos changed" };
    }

    public static changeLayout(uuid: string, layout: any): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.error(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] Layout changed for " + uuid);
        this.emit(EnumEventName.LAYOUT, layout, [uuid]);
        const user = UsersService.get(uuid)!;
        user.desktop = layout.desktop;
        this.emitUpdate.fools();

        return { success: true, message: "Layout changed" };
    }

    public static rename(uuid: string, newName: string): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.error(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] Rename " + uuid + " to " + newName);
        UsersService.get(uuid)!.name = newName;
        this.emit(EnumEventName.RENAME, newName, [uuid]);
        this.emitUpdate.fools();

        return { success: true, message: "User renamed" };
    }

    private static checkUuid(uuid: string, isAssociated?: boolean): APIResponse {
        if (!uuid) return { success: false, message: "No uuid provided" };
        if (typeof uuid !== "string") return { success: false, message: "Uuid must be a string" };
        if (isAssociated && !UsersService.exists(uuid)) {
            return { success: false, message: "User doesn't exist" };
        };
        return { success: true, message: "Uuid is valid" };
    }

    private static checkRole(role: string): APIResponse {
        if (!role) return { success: false, message: "No role provided" };
        if (typeof role !== "string") return { success: false, message: "Role must be a string" };
        if (!Object.values(EnumUserRole).includes(role as EnumUserRole)) {
            return { success: false, message: "Role must be a valid role" };
        }
        return { success: true, message: "Role is valid" };
    }

    public static emitUpdate = {
        resources: () => {
            this.emit(EnumEventName.UPDATE, { type: EnumUpdateType.RESOURCES, value: getData()});
        },
        fools: () => {
            this.emit(EnumEventName.UPDATE, { type: EnumUpdateType.FOOLS, value: UsersService.getFools()});
        },
    }

}