import { EnumUserRole } from "../enums/role";
import User from "../models/user";
import { UserPreferences } from "../types/user-preferences";

export default class UsersService {

    private static users: User[] = [];

    constructor() {}

    public static new(uuid: string, role: EnumUserRole, preferences?: UserPreferences): User {
        const user = new User(uuid, role, preferences);
        this.users.push(user);
        return user;
    }

    public static get(uuid: string): User | undefined {
        return this.users.find((user) => user.uuid == uuid);
    }

    public static remove(uuid: string) {
        const user = this.get(uuid);
        if (!user) return;
        const index = this.users.indexOf(user);
        if (index > -1) this.users.splice(index, 1);
    }

    public static getFools() {
        console.log("[-] Get fools");
        console.log([...this.users.filter((user) => user.role == EnumUserRole.FOOL)]);
        return [...this.users.filter((user) => user.role == EnumUserRole.FOOL)];
    }

    public static getMasters() {
        return [...this.users.filter((user) => user.role == EnumUserRole.MASTER)];
    }

    /**
     * Check if a user exists
     * @param uuid User id
     */
    public static exists(uuid: string) {
        return !!this.get(uuid);
    }
}