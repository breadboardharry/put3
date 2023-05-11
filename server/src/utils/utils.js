import fs from "fs";
import path from "path";
import paths from "../enums/paths.js";
import storage from "../modules/storage/storage.js";
import StorageUtils from "../modules/storage/utils.js";

let nameIndex = 1;
const newName = () => {
    return "PC-" + nameIndex++;
    // for (let i = 0; i < 24; i++) {
    //     const name = 'PC-' + String.fromCharCode(65 + i);
    //     if (!Object.values(users).find(user => user.name == name)) return name;
    // }
};

const getLastDesktopImage = () => {
    let defaultImage;
    let image;
    const files = storage.getFileList(paths.DESKTOPS);

    for (const file of files) {
        // Get the filename
        const filename = StorageUtils.getFilename(file);

        // Skip the default image
        if (filename === "default-desktop") {
            defaultImage = file;
            continue;
        }

        // Get the timestamp and check if it's the latest
        const timestamp = parseInt(filename.split("_")[1]);
        if (!image || timestamp > image.timestamp) image = {
            filename: file,
            timestamp
        }
    }

    // Return the latest image or the default image if no image was found
    return image ? image.filename : defaultImage;
};

const findDesktopImageName = (extensions = ["jpg", "png", "jpeg", "gif"]) => {
    return new Promise(async (resolve) => {
        const filename = "desktop";

        // For each extension, check if the file exists
        for (let extension of extensions) {
            try {
                fs.accessSync(path.join(paths.DESKTOPS, `${filename}.${extension}`));
                resolve(`${filename}.${extension}`);
                return;
            }
            catch (err) {}
        }
        // No image found
        resolve(null);
    });
};

// Return the file extension of a base64 image
// https://stackoverflow.com/questions/27886677/javascript-get-extension-from-base64-image
const getBase64FileExtension = (base64) => {
    switch (base64.charAt(0)) {
        case "/": return "jpg";

        case "i": return "png";

        case "R": return "gif";

        case "U": return "webp";

        default: return null;
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

const ipv6ToIpv4 = (ipv6Address) => {
    if (ipv6Address.startsWith("::ffff:")) {
      return ipv6Address.substr(7);
    }
    return ipv6Address;
}

const Utils = {
    newName,
    findDesktopImageName,
    getLastDesktopImage,
    getBase64FileExtension,
    isArrayOf,
    ipv6ToIpv4
};

export default Utils;
