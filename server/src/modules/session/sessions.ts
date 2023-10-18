import User from "../../models/user";
import { SessionService } from "../../services/users/sessions.service";
import SocketService from "../../services/socket/socket.service";
import UsersService from "../../services/users/users.service";
import { Session } from "../../models/session";
import { EnumEvent, EnumSessionActionType, EnumUserRole } from "put3-models";

export default class SessionModule {

    public static connect(master: User, sessionCode: string): void {
        const session = SessionService.find(sessionCode);
        if (!session) return;
        session.addMaster(master);
        this.emitUpdate.session(session);
    }

    public static event(sourceUuid: string, targetCode: string, action: any): void {
        const sourceUser = UsersService.find(sourceUuid);
        if (!sourceUser) throw new Error("[-] Undefined source user");
        const targetSession = SessionService.find(targetCode);
        if (!targetSession) throw new Error("[-] Undefined target session");

        console.log("[-] Event from " + sourceUuid + " to " + targetCode + ":", action);
        switch (action.type) {
            case EnumSessionActionType.RUN:
                SessionService.run(targetCode);
                break;
        }
        this.emitUpdate.session(targetSession);
    }

    public static disconnect(user: User): void {
        console.log("[-] Disconnecting user", user);
        if (user.role == EnumUserRole.FOOL) {
            // Delete the session
            const session = SessionService.getAssociatedSession(user.uuid);
            if (!session) return;
            SessionService.close(session.getCode());
            this.emitUpdate.session(session);
            SessionService.remove(session.getCode());
        }
        else if (user!.role == EnumUserRole.MASTER) {
            // Remove the user from all sessions and send update
            const session = SessionService.getAssociatedSession(user.uuid);
            if (!session) return;
            session.removeMaster(user.uuid);
            this.emitUpdate.session(session);
        }
        else throw new Error("[-] Unknown user role: " + user!.role);
    }

    public static canMasterSendToFool(masterUuid: string, isAdmin: boolean, foolUuid: string): boolean {
        if (isAdmin) return true;
        const session = SessionService.getMasterAssociatedSession(masterUuid)
        if (!session) return false;
        if (session.getFool().uuid == foolUuid) return true;
        return false
    }

    public updateUserAssociatedSessions(user: User): void {
        const session = SessionService.getAssociatedSession(user.uuid);
        if (!session) return;
        SessionModule.emitUpdate.session(session);
    }

    public static emitUpdate = {
        session: (session: Session) => {
            const usersUuids = session.getUsers().map((user) => user.uuid);
            const adminUuids = UsersService.getAdminUuids();
            const uuids = [...usersUuids, ...adminUuids];
            SocketService.emit(EnumEvent.SESSION, session, {targets: uuids});
        }
    }

}