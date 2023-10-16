import { EnumUserRole, UserPreferences } from "put3-models";

export default class User {

    private static NAME_INDEX = 1;

    public uuid: string;
    public name: string;
    public role: EnumUserRole;
    public infos: { [key: string]: any } = {};
    public desktop: { [key: string]: any } = {};
    public isAdmin: boolean = false;

    constructor(uuid: string, role: EnumUserRole, isAdmin: boolean, preferences?: UserPreferences) {
        this.uuid = uuid;
        this.role = role;
        this.isAdmin = isAdmin;
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
       return (this.isAdmin ? "ADMIN" : this.role.toUpperCase()) + "-" + User.NAME_INDEX++;
    }

};
