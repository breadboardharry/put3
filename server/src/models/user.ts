import { EnumUserRole } from "../enums/role";
import { UserPreferences } from "../types/user-preferences";

export default class User {

    private static NAME_INDEX = 1;

    public uuid: string;
    public name: string;
    public role: EnumUserRole;
    public infos: { [key: string]: any } = {};
    public desktop: { [key: string]: any } = {};

    constructor(uuid: string, role: EnumUserRole, preferences?: UserPreferences) {
        this.uuid = uuid;
        this.role = role;
        this.name = preferences?.name ? preferences.name : this.newName();
        this.setPreferences(preferences);
    }

    public setPreferences(preferences: UserPreferences = {}) {
        if (preferences.name) this.name = preferences.name;
        if (preferences.desktop) this.desktop = preferences.desktop;
    }

    public toString() {
        return `User ${this.name} :
        uuid: ${this.uuid}
        role: ${this.role}`;
    }

    private newName(): string {
       return this.role.toUpperCase() + "-" + User.NAME_INDEX++;
    }

};
