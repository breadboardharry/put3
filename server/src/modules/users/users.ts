import { EnumUserRole } from "../../enums/role";
import UsersService from "../../services/users.service";
import { getData } from "../resources/resources";
import { APIResponse } from "../../types/response";
import { EnumUpdateType } from "../../enums/update-type";
import { UserPreferences } from "../../types/user-preferences";
import { EnumEventName } from "../../enums/event-name";
import { SessionService } from "../../services/sessions.service";
import SessionModule from "../session/sessions";
import SocketService from "../../services/socket/socket";

export default class UserModule {

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

    public static setRole(uuid: string, role: string, data: { sessionCode?: string, preferences?: UserPreferences, isAdmin: boolean }): APIResponse {
        console.log("[-] Is admin: " + data.isAdmin);

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

            if (role == EnumUserRole.MASTER && !data.isAdmin) {
                if (!SessionService.find(data.sessionCode!)) {
                    return { success: false, message: "Session doesn't exist" };
                }
            }

            const user = UsersService.new(uuid, role as EnumUserRole, data.preferences);
            if (role == EnumUserRole.FOOL) {
                const session = SessionService.new(user);
                SocketService.emit(EnumEventName.ROLE, {
                    uuid: user.uuid,
                    name: user.name,
                    role: user.role,
                    sessionCode: session.getCode(),
                }, { targets: [uuid]});
            }
            else if (role == EnumUserRole.MASTER) {
                SocketService.emit(EnumEventName.ROLE, {
                    uuid: user.uuid,
                    name: user.name,
                    role: user.role,
                }, { targets: [uuid]});
                if (!data.isAdmin) SessionModule.connect(user, data.sessionCode!);
            }
        }

        this.emitUpdate.fools();
        return { success: true, message: "Role changed" };
    }

    public static sendAction(sender: { uuid: string, isAdmin?: boolean }, targetUuid: string, action: any): APIResponse {
        console.log("[-] Action from " + sender.uuid + " to " + targetUuid);
        const checkUuid = this.checkUuid(targetUuid);
        if (!checkUuid.success) {
            console.error(checkUuid.message);
            return checkUuid;
        }

        // Check if the sender has the right to send an action to the target
        if (!SessionModule.canMasterSendToFool(sender.uuid, sender.isAdmin!, targetUuid)) {
            console.error("[-] User " + sender.uuid + " doesn't have the right to send an action to " + targetUuid);
            return { success: false, message: "You don't have the right to send an action to this user" };
        }

        console.log("[-] Action sent to " + targetUuid);
        SocketService.emit(EnumEventName.ACTION, action, { targets: [targetUuid]});

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
        SocketService.emit(EnumEventName.LAYOUT, layout, { targets: [uuid]});
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
        SocketService.emit(EnumEventName.RENAME, newName, { targets: [uuid]});
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
            SocketService.emit(EnumEventName.UPDATE, { type: EnumUpdateType.RESOURCES, value: getData()});
        },
        fools: () => {
            SocketService.emit(EnumEventName.UPDATE, { type: EnumUpdateType.FOOLS, value: UsersService.getFools()});
        },
    }

}