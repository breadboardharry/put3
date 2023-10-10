import { User } from "../models/user";

export class Session {

    private code: string = this.generateCode();
    private fool: User;
    public masters: User[] = [];

    constructor(fool: User) {
        this.fool = fool;
    }

    public getCode(): string {
        return this.code;
    }

    public getFool(): User {
        return this.fool;
    }

    public getMasters(): User[] {
        return this.masters;
    }

    public addMaster(master: User) {
        this.masters.push(master);
    }

    public getUsers(): User[] {
        return [this.fool, ...this.masters];
    }

    public removeMaster(uuid: string) {
        const index = this.masters.findIndex((master) => master.uuid == uuid);
        if (index > -1) this.masters.splice(index, 1);
    }

    private generateCode(): string {
        const length = 5;
        let code = "";
        for (let i = 0; i < length; i++) {
            code += (String(Math.floor(Math.random() * 10)));
        }
        return code;
    }

}

export class SessionService {

    private static sessions: Session[] = [];

    public static new(fool: User): Session {
        const session = new Session(fool);
        this.sessions.push(session);
        return session;
    }

    public static getSessions(): Session[] {
        return this.sessions;
    }

    public static getMasterAssociatedSessions(uuid: string): Session[] {
        return this.sessions.filter((session) => session.getMasters().find((master) => master.uuid == uuid));
    }

    public static getFoolAssociatedSession(uuid: string): Session | undefined {
        return this.sessions.find((session) => session.getFool().uuid == uuid);
    }

    public static find(code: string): Session | undefined {
        return this.sessions.find((session) => session.getCode() == code);
    }

    public static remove(code: string) {
        const session = SessionService.find(code);
        if (!session) return;
        const index = this.sessions.indexOf(session);
        if (index > -1) this.sessions.splice(index, 1);
    }

}