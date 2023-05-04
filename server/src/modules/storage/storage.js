import fs from "fs";
import path from "path";
import utils from "./utils.js";

const getResources = (dirname) => {
    const dirpath = path.join("./public", dirname);

    // Check if the directory exists
    if (!fs.existsSync(dirpath)) throw new Error("Directory not found");

    // For each file in the directory, get the file info
    const files = fs.readdirSync(dirpath).map((file) => {
        return utils.getFileData("image", file, dirpath);
    });

    return files;
};

const deleteFiles = (filenames, dirname) => {
    const count = {
        success: 0,
        failed: 0
    };

    for (let filename of filenames) {
        const filepath = path.join("./public", dirname, filename);

        // Check if the file exists
        if (!fs.existsSync(filepath)) {
            count.failed++;
            continue;
        }

        // Delete the file
        try {
            fs.unlinkSync(filepath);
            count.success++;
        }
        catch (err) {
            console.log("[!] Error deleting file: " + filepath + "\n" + err + "\n")
            count.failed++;
        }
    }

    return count;
};

const StorageModule = {
    deleteFiles,
    getResources
};

export default StorageModule;
