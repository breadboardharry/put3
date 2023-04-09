function toArray(users) {
    return Object.keys(users).map((id) => ({ ...users[id], id }));
}

module.exports = { toArray };