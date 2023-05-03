import Utils from "../utils/utils.js";

export default class User {
  id;
  status = "pending";
  name = undefined;
  role = undefined;

  constructor(id) {
    this.id = id;
  }

  newRole(role) {
    this.status = role == "fool" ? "editing" : "active";
    this.role = role;

    if (role == "fool") this.name = Utils.newName();
  }

  toString() {
    return `User ${this.name} :
      id: ${this.id}
      status: ${this.status}
      role: ${this.role}`;
  }
};
