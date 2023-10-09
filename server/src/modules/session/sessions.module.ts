import { User } from "../../models/user";

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

    public addMaster(master: User) {
        this.masters.push(master);
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

export class SessionModule {

    private static sessions: Session[] = [];

    public static new(fool: User): Session {
        const session = new Session(fool);
        this.sessions.push(session);
        return session;
    }

    public static getSessions(): Session[] {
        return this.sessions;
    }

    public static find(code: string): Session | undefined {
        return this.sessions.find((session) => session.getCode() == code);
    }

    public static remove(code: string) {
        const session = SessionModule.find(code);
        if (!session) return;
        const index = this.sessions.indexOf(session);
        if (index > -1) this.sessions.splice(index, 1);
    }

}