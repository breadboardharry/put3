import { EnumEventName } from "../../enums/event-name";
import User from "../../models/user";
import { Session, SessionService } from "../../services/users/sessions.service";
import { EnumUserRole } from "../../enums/role";
import SocketService from "../../services/socket/socket.service";
import UsersService from "../../services/users/users.service";

export default class SessionModule {

    public static connect(master: User, sessionCode: string): void {
        const session = SessionService.find(sessionCode);
        if (!session) return;
        session.addMaster(master);
        this.emitUpdate.session(session);
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
            SocketService.emit(EnumEventName.SESSION, session, {targets: uuids});
        }
    }

}