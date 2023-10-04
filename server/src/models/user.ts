import { EnumUserRole } from "../enums/role";
import { SocketServer } from "../modules/socket-server/socket-server";

export class User {

    private static NAME_INDEX = 1;

    public id: number;
    public name!: string;
    public role: EnumUserRole = EnumUserRole.UNDEFINED;
    public infos: { [key: string]: any } = {};
    public desktop: { [key: string]: any } = {};

    constructor(id: number) {
        this.id = id;
    }

    public setRole(role: EnumUserRole, preferences: { [key: string]: any } = {}) {
        this.role = role;
        if (role == EnumUserRole.FOOL && !preferences.name) {
            this.name = User.newName();
            // TODO
            SocketServer.update.name({
                target: this,
                name: this.name
            });
        }
        this.setPreferences(preferences);
    }

    public setPreferences(preferences: { [key: string]: any } = {}) {
        if (preferences.name) this.name = preferences.name;
        if (preferences.desktop) this.desktop = preferences.desktop;
    }

    public toString() {
        return `User ${this.name} :
        id: ${this.id}
        role: ${this.role}`;
    }

    private static newName(): string {
        return "PC-" + this.NAME_INDEX++;
    }

};
