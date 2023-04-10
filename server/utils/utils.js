function toArray(users) {
    return Object.keys(users).map((id) => ({ ...users[id], id }));
}

function newName(users) {
    for (let i = 0; i < 24; i++) {
        const name = 'PC-' + String.fromCharCode(65 + i);
        if (!Object.values(users).find(user => user.name == name)) return name;
    }
}

module.exports = { toArray, newName };