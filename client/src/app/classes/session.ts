import { EnumSessionStatus } from "put3-models";
import { Fool } from "./fool";

export type SessionData = {
    code: string;
    masters: string[];
    fool: { uuid: string, name: string, desktop: any, infos: any };
    status: EnumSessionStatus;
};

export class Session {

    public code: string;
    public masters: string[];
    public fool: Fool;
    public status: EnumSessionStatus;

    constructor(data: SessionData) {
        this.code = data.code;
        this.masters = data.masters;
        this.fool = new Fool(data.fool);
        this.status = data.status;
    }

    public update(data: SessionData | Session) {
        this.masters = data.masters;
        const prevHitboxes = this.fool.layout.hitboxes;
        this.fool.update(data.fool);
        this.fool.layout.hitboxes = prevHitboxes;
        this.status = data.status;
    }

}