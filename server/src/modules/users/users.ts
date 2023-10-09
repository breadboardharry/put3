import { EnumUserRole } from "../../enums/role";
import UsersService from "../../services/users.service";
import { Subject } from "rxjs";
import { getData } from "../resources/resources";
import { APIResponse } from "../../types/response";
import { EnumUpdateType } from "../../enums/update-type";

type EmitParams = {key: string, data: any};

export enum EnumEventName {
    UUID = "uuid",
    ROLE = "role",
    ACTION = "action",
    INFOS = "infos",
    LAYOUT = "layout",
    RENAME = "rename",
    UPDATE = "update",
};

export class UserModule {

    public static emitSubject: Subject<EmitParams> = new Subject<EmitParams>();

    private static emit(key: string, targetUuid?: string, data?: any) {
        const params = { key, data: {
            target: {uuid: targetUuid},
            data
        }};
        this.emitSubject.next(params);
    }

    public static connect(uuid: string): APIResponse {
        const checkUuid = this.checkUuid(uuid, false);
        if (!checkUuid.success) {
            console.log(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] New user connected: " + uuid);
        UsersService.new(uuid);
        this.emit(EnumEventName.UUID, undefined, uuid);

        return { success: true, message: "User created" };
    }

    public static disconnect(uuid: string): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.log(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] User disconnected: " + uuid);
        UsersService.remove(uuid);
        this.emitUpdate.fools();

        return { success: true, message: "User deleted" };
    }

    public static changeRole(uuid: string, role: string, preferences: any): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.log(checkUuid.message);
            return checkUuid;
        }

        const checkRole = this.checkRole(role);
        if (!checkRole.success) {
            console.log(checkRole.message);
            return checkRole;
        }

        console.log("[-] User " + uuid + " selected role " + role);
        const user = UsersService.get(uuid)!;
        const newName = user.setRole(role as EnumUserRole, preferences);
        if (newName) this.emit(EnumEventName.RENAME, uuid, newName);
        this.emitUpdate.fools();

        return { success: true, message: "Role changed" };
    }

    public static sendAction(uuid: string, action: any): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.log(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] Action sent to " + uuid);
        this.emit(EnumEventName.ACTION, uuid, action);

        return { success: true, message: "Action sent" };
    }

    public static changeInfos(uuid: string, infos: any): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.log(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] Infos changed for " + uuid);
        UsersService.get(uuid)!.infos = {...UsersService.get(uuid)!.infos, ...infos};
        this.emitUpdate.fools();

        return { success: true, message: "Infos changed" };
    }

    public static changeLayout(uuid: string, layout: any): APIResponse {
        console.log("[-] Layout changed for " + uuid);
        console.log(layout);

        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.log(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] Layout changed for " + uuid);
        this.emit(EnumEventName.LAYOUT, uuid, layout);
        const user = UsersService.get(uuid)!;
        user.desktop = layout.desktop;
        this.emitUpdate.fools();

        return { success: true, message: "Layout changed" };
    }

    public static rename(uuid: string, newName: string): APIResponse {
        const checkUuid = this.checkUuid(uuid);
        if (!checkUuid.success) {
            console.log(checkUuid.message);
            return checkUuid;
        }

        console.log("[-] Rename " + uuid + " to " + newName);
        UsersService.get(uuid)!.name = newName;
        this.emit(EnumEventName.RENAME, uuid, newName);
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
            this.emit(EnumEventName.UPDATE, undefined, { type: EnumUpdateType.RESOURCES, value: getData()});
        },
        fools: () => {
            this.emit(EnumEventName.UPDATE, undefined, { type: EnumUpdateType.FOOLS, value: UsersService.getFools()});
        },
    }

}