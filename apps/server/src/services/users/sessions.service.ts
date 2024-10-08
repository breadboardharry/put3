import { Session } from "../../models/session";
import User from "../../models/user";

export class SessionService {

    private static sessions: Session[] = [];

    public static new(fool: User): Session {
        const session = new Session(fool);
        this.sessions.push(session);
        return session;
    }

    public static getAll(): Session[] {
        return this.sessions;
    }

    public static getAssociatedSession(uuid: string): Session | undefined {
        return this.sessions.find((session) => session.getUsers().find((user) => user.uuid == uuid));
    }

    public static getMasterAssociatedSession(uuid: string): Session | undefined {
        return this.sessions.find((session) => session.getMasters().find((master) => master.uuid == uuid));
    }

    public static getFoolAssociatedSession(uuid: string): Session | undefined {
        return this.sessions.find((session) => session.getFool().uuid == uuid);
    }

    public static find(code: string): Session | undefined {
        return this.sessions.find((session) => session.getCode() == code);
    }

    public static run(code: string): void {
        const session = this.find(code);
        if (!session) return;
        session.run();
    }

    public static close(code: string): Session | undefined {
        const session = this.find(code);
        if (!session) return;
        session.close();
        return session;
    }

    public static remove(code: string) {
        const session = this.find(code);
        if (!session) return;
        const index = this.sessions.indexOf(session);
        if (index > -1) this.sessions.splice(index, 1);
    }

}