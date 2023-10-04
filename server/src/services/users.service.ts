import { EnumUserRole } from "../enums/role";
import { User } from "../models/user";

export default class UsersService {

    private static users: User[] = [];

    constructor() {}

    public static new(id: number) {
        this.users.push(new User(id));
    }

    public static get(id: number): User | undefined {
        return this.users.find((user) => user.id == id);
    }

    public static remove(id: number) {
        const user = this.get(id);
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
     * @param id User id
     * @return User exists
     */
    public static exists(id: number) {
        return !!this.get(id);
    }
}