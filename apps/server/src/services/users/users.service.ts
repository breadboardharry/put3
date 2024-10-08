import { EnumUserRole } from "../../app-models/enums/user";
import { UserPreferences } from "../../app-models/types/preferences";
import User from "../../models/user";

export default class UsersService {

    private static users: User[] = [];

    constructor() {}

    public static new(uuid: string, role: EnumUserRole, isAdmin: boolean, preferences?: UserPreferences): User {
        const user = new User(uuid, role, isAdmin, preferences);
        this.users.push(user);
        return user;
    }

    public static find(uuid: string): User | undefined {
        if (!uuid || typeof uuid != 'string') return;
        return this.users.find((user) => user.uuid == uuid);
    }

    public static remove(uuid: string) {
        const user = this.find(uuid);
        if (!user) return;
        const index = this.users.indexOf(user);
        if (index > -1) this.users.splice(index, 1);
    }

    public static getFools() {
        return [...this.users.filter((user) => user.role == EnumUserRole.FOOL)];
    }

    public static getFoolUuids() {
        return this.getFools().map((user) => user.uuid);
    }

    public static getMasters() {
        return [...this.users.filter((user) => user.role == EnumUserRole.MASTER)];
    }

    public static getMasterUuids() {
        return this.getMasters().map((user) => user.uuid);
    }

    public static getAdmins() {
        return [...this.getMasters().filter((user) => user.isAdmin)];
    }

    public static getAdminUuids() {
        return this.getAdmins().map((user) => user.uuid);
    }

    /**
     * Check if a user exists
     * @param uuid User id
     */
    public static exists(uuid: string) {
        return !!this.find(uuid);
    }
}