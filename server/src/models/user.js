import Utils from "../utils/utils.js";

export default class User {
  id;
  name = undefined;
  role = undefined;
  data = {};
  infos = {};

  constructor(id) {
    this.id = id;
  }

  newRole(role) {
    this.role = role;
    if (role == "fool") this.name = Utils.newName();
  }

  toString() {
    return `User ${this.name} :
      id: ${this.id}
      role: ${this.role}`;
  }
};
