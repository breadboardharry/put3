import utils from "../utils/utils.js";

/**
 * Get connected fool list
 * @return {Array} Fool list
 */
const foolList = (users) => {
  return Object.values(utils.toArray(users)).filter(
    (user) => user.role == "fool"
  );
}

const UserModule = {
  foolList
}

export default UserModule;
