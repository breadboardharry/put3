import User from "../../models/user";

export enum EnumSessionStatus {
    PENDING = "pending",
    RUNNING = "running",
    CLOSED = "closed"
}

export class Session {

    private code: string = this.generateCode();
    private fool: User;
    public masters: User[] = [];
    public status: EnumSessionStatus = EnumSessionStatus.PENDING;

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

    public close(): void {
        this.status = EnumSessionStatus.CLOSED;
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