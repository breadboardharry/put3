import UsersService from "../../services/users/users.service";
import { getData } from "../resources/resources";
import { APIResponse } from "../../types/response";
import { SessionService } from "../../services/users/sessions.service";
import SessionModule from "../session/sessions";
import SocketService from "../../services/socket/socket.service";
import { Action, EnumEvent, EnumInfoStyle, EnumUserRole, FoolInfos, UserPreferences } from "put3-models";

export default class UserModule {

    public static connect(uuid: string): APIResponse {
        console.log("[-] New user connected: " + uuid);
        return { success: true };
    }

    public static disconnect(uuid: string): APIResponse {
        const user = UsersService.find(uuid);
        if (!user) return { success: false, message: "User doesn't exist" };

        console.log("[-] User disconnected: " + user.uuid);
        SessionModule.disconnect(user);
        UsersService.remove(user.uuid);

        return { success: true, message: "User deleted" };
    }

    public static setRole(uuid: string, role: EnumUserRole, data: { sessionCode?: string, preferences?: UserPreferences, isAdmin: boolean }): APIResponse {
        const userExists = !!UsersService.find(uuid);
        if (userExists) {
            UsersService.remove(uuid);
        }

        console.log("[-] User " + uuid + " selected role " + role);
        if (role == EnumUserRole.MASTER && !data.isAdmin) {
            if (!SessionService.find(data.sessionCode!)) {
                console.error("[-] Session " + data.sessionCode + " doesn't exist");
                return { success: false, message: "Session doesn't exist" };
            }
        }

        const isAdmin = (role == EnumUserRole.MASTER) ? data.isAdmin : false;
        const user = UsersService.new(uuid, role, isAdmin, data.preferences);
        console.log("[-] User " + uuid + " created:", user);
        if (role == EnumUserRole.FOOL) {
            const session = SessionService.new(user);
            SocketService.emit(EnumEvent.ROLE, {
                uuid: user.uuid,
                name: user.name,
                role: EnumUserRole.FOOL,
                sessionCode: session.getCode(),
            }, { targets: [uuid]});
        }
        else if (role == EnumUserRole.MASTER) {
            SocketService.emit(EnumEvent.ROLE, {
                uuid: user.uuid,
                name: user.name,
                role: EnumUserRole.MASTER,
                sessionCode: isAdmin ? undefined : data.sessionCode,
            }, { targets: [uuid]});
            if (!user.isAdmin) SessionModule.connect(user, data.sessionCode!);
        }
        else throw new Error("[-] Unknown role: " + role);

        return { success: true, message: "Role changed" };
    }

    public static sendAction(sourceUuid: string, targetUuid: string, action: Action): APIResponse {
        const sourceUser = UsersService.find(sourceUuid);
        if (!sourceUser) throw new Error("[-] Undefined source user");
        const targetUser = UsersService.find(targetUuid);
        if (!targetUser) throw new Error("[-] Undefined target user");

        // Check if the sender has the right to send an action to the target
        if (!SessionModule.canMasterSendToFool(sourceUser.uuid, sourceUser.isAdmin, targetUuid)) {
            console.error("[-] User " + sourceUser.uuid + " doesn't have the right to send an action to " + targetUuid);
            return { success: false, message: "You don't have the right to send an action to this user" };
        }

        console.log("[-] Action from " + sourceUser.uuid + " to " + targetUuid);
        SocketService.emit(EnumEvent.ACTION, action, { targets: [targetUuid]});

        return { success: true, message: "Action sent" };
    }

    public static changeInfos(userUuid: string, infos: FoolInfos): APIResponse {
        const user = UsersService.find(userUuid);
        if (!user) throw new Error("[-] Undefined user");

        if (user.role != EnumUserRole.FOOL) {
            return { success: false, message: "You can't change infos for this user" };
        }
        user.infos = {...user.infos, ...infos};
        SessionModule.emitUpdate.session(SessionService.getFoolAssociatedSession(user.uuid)!);

        return { success: true, message: "Infos changed" };
    }

    public static changeLayout(sourceUuid: string, targetUuid: string, layout: any): APIResponse {
        const sourceUser = UsersService.find(sourceUuid);
        if (!sourceUser) throw new Error("[-] Undefined source user");
        const targetUser = UsersService.find(targetUuid);
        if (!targetUser) throw new Error("[-] Undefined target user");

        // Check if the sender has the right to send an action to the target
        if (!SessionModule.canMasterSendToFool(sourceUser.uuid, sourceUser.isAdmin, targetUuid)) {
            console.error("[-] User " + sourceUser.uuid + " doesn't have the right to change the layout of " + targetUuid);
            return { success: false, message: "You don't have the right to change the layout of this user" };
        }

        if (targetUser.role != EnumUserRole.FOOL) {
            return { success: false, message: "You can't change infos for this user" };
        }
        console.log("[-] Layout changed for " + targetUuid);
        targetUser.desktop = layout.desktop;
        SocketService.emit(EnumEvent.LAYOUT, layout, { targets: [targetUuid]});
        SessionModule.emitUpdate.session(SessionService.getFoolAssociatedSession(targetUuid)!);

        return { success: true, message: "Layout changed" };
    }

    public static rename(sourceUuid: string, targetUuid: string, newName: string): APIResponse {
        const sourceUser = UsersService.find(sourceUuid);
        if (!sourceUser) throw new Error("[-] Undefined source user");
        const targetUser = UsersService.find(targetUuid);
        if (!targetUser) throw new Error("[-] Undefined target user");

        if (targetUser.role != EnumUserRole.FOOL) {
            return { success: false };
        }
        targetUser.name = newName;
        SocketService.emit(EnumEvent.RENAME, newName, { targets: [targetUuid]});
        SessionModule.emitUpdate.session(SessionService.getFoolAssociatedSession(targetUuid)!);

        return { success: true, message: "User renamed" };
    }

    public static sendMessage(uuid: string, message: string, type: EnumInfoStyle): void {
        SocketService.emit(EnumEvent.MESSAGE, { type, text: message }, { targets: [uuid]});
    }

    public static emitUpdate = {
        resources: () => {
            SocketService.emit(EnumEvent.RESOURCES, getData());
        },
    }

}