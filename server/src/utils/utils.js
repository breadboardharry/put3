import fs from "fs";

let nameIndex = 1;
const newName = () => {
    return "PC-" + nameIndex++;
    // for (let i = 0; i < 24; i++) {
    //     const name = 'PC-' + String.fromCharCode(65 + i);
    //     if (!Object.values(users).find(user => user.name == name)) return name;
    // }
};

const findDesktopImageName = (extensions = ["jpg", "png", "jpeg", "gif"]) => {
    return new Promise(async (resolve, reject) => {
        const filename = "desktop";

        // For each extension, check if the file exists
        for (let extension of extensions) {
            try {
                fs.accessSync(`./public/images/${filename}.${extension}`);
                resolve(`${filename}.${extension}`);
                return;
            } catch (err) {}
        }
        // No image found
        resolve(null);
    });
};

// Return the file extension of a base64 image
// https://stackoverflow.com/questions/27886677/javascript-get-extension-from-base64-image
const getBase64FileExtension = (base64) => {
    switch (base64.charAt(0)) {
        case "/":
            return "jpg";

        case "i":
            return "png";

        case "R":
            return "gif";

        case "U":
            return "webp";

        default:
            return null;
    }
};

const isArrayOf = (type, array, notNull = false) => {
    if (!Array.isArray(array)) return false;

    for (let item of array) {
        if (typeof item !== type) return false;
        if (notNull && !item) return false;
    }
    return true;
};

const Utils = {
    newName,
    findDesktopImageName,
    getBase64FileExtension,
    isArrayOf
};

export default Utils;
