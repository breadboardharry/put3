import { Subject } from "rxjs";
import { EnumEventName } from "../../enums/event-name";
import { User } from "../../models/user";
import { Session, SessionService } from "../../services/sessions.service";
import { EmitParams } from "../socket-server/socket-server";
import { EnumUserRole } from "../../enums/role";

export class SessionModule {

    public static emitSubject: Subject<EmitParams> = new Subject<EmitParams>();

    private static emit(key: string, data?: any, targetUuids?: string[]) {
        const params: EmitParams = { key, targetIds: targetUuids, data: {data} };
        this.emitSubject.next(params);
    }

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

    public static emitUpdate = {
        session: (session: Session) => {
            const users = session.getUsers();
            const uuids = users.map((user) => user.uuid);
            this.emit(EnumEventName.SESSION, session, uuids);
        }
    }

}