import { EnumUserRole } from "../enums/role";
import { UserModule } from "../modules/users/users";

export class User {

    private static NAME_INDEX = 1;

    public uuid: string;
    public name!: string;
    public role: EnumUserRole = EnumUserRole.UNDEFINED;
    public infos: { [key: string]: any } = {};
    public desktop: { [key: string]: any } = {};

    constructor(uuid: string) {
        this.uuid = uuid;
    }

    public setRole(role: EnumUserRole, preferences: { [key: string]: any } = {}): string | undefined {
        let newName: string | undefined;
        this.role = role;
        if (role == EnumUserRole.FOOL && !preferences.name) {
            this.name = User.newName();
            newName = this.name;
        }
        this.setPreferences(preferences);
        return newName;
    }

    public setPreferences(preferences: { [key: string]: any } = {}) {
        if (preferences.name) this.name = preferences.name;
        if (preferences.desktop) this.desktop = preferences.desktop;
    }

    public toString() {
        return `User ${this.name} :
        uuid: ${this.uuid}
        role: ${this.role}`;
    }

    private static newName(): string {
        return "PC-" + this.NAME_INDEX++;
    }

};
