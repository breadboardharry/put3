import { EnumUserRole } from "../enums/role";
import { User } from "../models/user";
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

    /**
     * Get connected fool list
     * @return Fool list
     */
    public static getFools() {
        return JSON.parse(JSON.stringify(this.users.filter((user) => user.role == EnumUserRole.FOOL)));
    }

    /**
     * Check if a user exists
     * @param uuid User id
     * @return User exists
     */
    public static exists(uuid: string) {
        return !!this.get(uuid);
    }
}