import Utils from "../utils/utils.js";
import Role from "../enums/role.js";
import Socket from "../modules/socket/socket.js";

export default class User {
    id;
    name = undefined;
    role = undefined;
    infos = {};
    desktop = {};

    constructor(id) {
        this.id = id;
    }

    setRole(role, preferences = {}) {
        this.role = role;
        if (role == Role.Fool && !preferences.name) {
            this.name = Utils.newName();
            Socket.update.name({
                target: this,
                name: this.name
            });
        }
        this.setPreferences(preferences);
    }

    setPreferences(preferences) {
        if (preferences.name) this.name = preferences.name;
        if (preferences.desktop) this.desktop = preferences.desktop;
    }

    toString() {
        return `User ${this.name} :
        id: ${this.id}
        role: ${this.role}`;
    }
};
