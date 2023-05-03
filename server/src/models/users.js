import User from "./user.js";

export default class Users {
  #users;

  constructor() {
    this.#users = [];
  }

  new(id) {
    this.#users.push(new User(id));
  }

  user(id) {
    return this.#users.find((user) => user.id == id);
  }

  remove(id) {
    const index = this.#users.indexOf(this.user(id));
    if (index > -1) this.#users.splice(index, 1);
  }

  /**
   * Get connected fool list
   * @return {Array} Fool list
   */
  getFools() {
    return JSON.parse(JSON.stringify(this.#users.filter((user) => user.role == "fool")));
  }
}
