import { EnumSessionStatus } from "../app-models/enums/session";
import User from "./user";

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

    public run(): void {
        this.status = EnumSessionStatus.RUNNING;
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