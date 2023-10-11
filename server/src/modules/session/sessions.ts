import { EnumEventName } from "../../enums/event-name";
import User from "../../models/user";
import { Session, SessionService } from "../../services/sessions.service";
import { EnumUserRole } from "../../enums/role";
import SocketService from "../../services/socket/socket";

export default class SessionModule {

    public static connect(master: User, sessionCode: string): void {
        const session = SessionService.find(sessionCode);
        if (!session) return;
        session.addMaster(master);
        this.emitUpdate.session(session);
    }

    public static disconnect(user: User): void {
        if (user.role == EnumUserRole.FOOL) {
            // Delete the session
            const session = SessionService.getFoolAssociatedSession(user.uuid);
            if (session) SessionService.remove(session.getCode());
        }
        else if (user!.role == EnumUserRole.MASTER) {
            // Remove the user from all sessions and send update
            const sessions = SessionService.getMasterAssociatedSessions(user.uuid);
            if (sessions.length) {
                for (const session of sessions) {
                    session.removeMaster(user.uuid);
                    this.emitUpdate.session(session);
                }
            }
        }
    }

    public static canMasterSendToFool(masterUuid: string, isAdmin: boolean, foolUuid: string): boolean {
        if (isAdmin) return true;
        const sessions = SessionService.getMasterAssociatedSessions(masterUuid)
        for (const session of sessions) {
            if (session.getFool().uuid == foolUuid) return true;
        }
        return false
    }

    public static emitUpdate = {
        session: (session: Session) => {
            const users = session.getUsers();
            const uuids = users.map((user) => user.uuid);
            SocketService.emit(EnumEventName.SESSION, session, {targets: uuids});
        }
    }

}