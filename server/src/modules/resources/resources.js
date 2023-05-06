import fs from "fs";
import path from "path";
import utils from "./utils.js";
import paths from "../../enums/paths.js";
import ResourcesUtils from "./utils.js";
import Storage from "../storage/storage.js";
import Utils from "../../utils/utils.js";

const getData = (dirname) => {

    // Check if the directory is valid
    if (dirname && !ResourcesUtils.isValidDir(dirname)) {
        throw {
            success: false,
            message: "Invalid directory"
        };
    }

    try {
        const dirnames = dirname ? [dirname] : utils.getDirectories();
        const files = {};

        for (let dirname of dirnames) {
            const dirpath = path.join(paths.RESOURCES, dirname);

            // Check if the directory exists
            if (!fs.existsSync(dirpath)) throw new Error("Directory not found");

            // For each file in the directory, get the file info
            files[dirname] = utils.getFilesData(dirname);
        }

        return files;
    }

    // Normal process error
    catch (err) {
        console.log("[!] Error getting ressources data: " + err + "\n");
        throw {
            success: false,
            message: "Internal server error"
        };
    };

};

const unlink = (filesname) => {

    let files = [];

    // Check input
    try {
        if (!Utils.isArrayOf("string", filesname)) throw 1;

        files = filesname.map((filename) => {
            const dirname = ResourcesUtils.extToDir(Utils.getFileExtension(filename));

            return {
                name: filename,
                dirpath: path.join("resources", dirname)
            }
        });
    }
    catch (err) {
        throw {
            success: false,
            message: "Invalid input"
        };
    };

    // Delete files
    try {
        let success = 0, failed = 0;

        for (const file of files) {
            if (Storage.deleteFile(file.name, file.dirpath)) success++;
            else failed++;
        }

        return { success, failed };
    }

    // Normal process error
    catch (err) {
        console.log("[!] Error getting ressources data: " + err + "\n");
        throw {
            success: false,
            message: "Internal server error"
        };
    };
};

const ResourcesModule = {
    getData,
    unlink
};

export default ResourcesModule;

