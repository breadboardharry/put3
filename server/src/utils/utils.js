let nameIndex = 1;
function newName() {
  return "PC-" + nameIndex++;
  // for (let i = 0; i < 24; i++) {
  //     const name = 'PC-' + String.fromCharCode(65 + i);
  //     if (!Object.values(users).find(user => user.name == name)) return name;
  // }
}

export default { newName };
