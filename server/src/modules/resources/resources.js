import fs from "fs";
import path from "path";
import utils from "./utils.js";
import paths from "../../enums/paths.js";
import ResourcesUtils from "./utils.js";
import Storage from "../storage/storage.js";
import Utils from "../../utils/utils.js";
import Response from "../../enums/response.js"
import Paths from "../../enums/paths.js";
import StorageUtils from "../storage/utils.js";

const getData = (dirname) => {

    // Check if the directory is valid
    if (dirname && !ResourcesUtils.isValidDir(dirname)) {
        throw Response.ERROR.INVALID_DIRNAME;
    }

    try {
        const dirnames = dirname ? [dirname] : utils.getDirectories();
        let files = {};

        for (let dirname of dirnames) {
            const dirpath = path.join(paths.RESOURCES, dirname);

            // Check if the directory exists
            if (!fs.existsSync(dirpath)) throw new Error("Directory not found");

            // For each file in the directory, get the file info
            const data = utils.getFilesData(dirname);
            dirnames.length > 1 ? files[dirname] = data : files = data;
        }

        return files;
    }

    // Normal process error
    catch (err) {
        console.log("[!] Error getting ressources data: " + err + "\n");
        throw Response.ERROR.INTERNAL_SERVER;
    };

};

const unlink = (filesname) => {

    let files = [];

    // Check input
    try {
        if (!Utils.isArrayOf("string", filesname)) throw 1;

        files = filesname.map((filename) => {
            const dirname = ResourcesUtils.extToDir(StorageUtils.getFileExtension(filename));

            return {
                name: filename,
                dirpath: path.join(Paths.RESOURCES, dirname)
            }
        });
    }
    catch (err) {
        throw Response.ERROR.INVALID_PARAMS;
    };

    // Delete files
    try {
        let success = 0, failed = 0;

        for (const file of files)
            Storage.deleteFile(file.name, file.dirpath) ? success++ :failed++;

        return {
            success: success > 0,
            affected: success,
            failed
        };
    }

    // Normal process error
    catch (err) {
        console.log("[!] Error getting ressources data: " + err + "\n");
        throw Response.ERROR.INTERNAL_SERVER;
    };
};

const rename = (currentName, newName) => {
    // Check parameters type
    if (typeof(currentName) !== "string" || typeof(newName) !== "string") {
        throw Response.ERROR.INVALID_PARAMS;
    }
    // Check if parameters are empty
    if (!StorageUtils.removeFileExtension(currentName) || !StorageUtils.removeFileExtension(newName)) {
        throw Response.ERROR.INVALID_PARAMS;
    }
    // Check if names are the same
    if (currentName == newName) {
        throw Response.SUCCESS.DEFAULT;
    }
    // Check if file extension is the same
    if (StorageUtils.getFileExtension(currentName) !== StorageUtils.getFileExtension(newName)) {
        throw Response.ERROR.INVALID_FILE_EXTENSION;
    }

    try {
        const success = ResourcesUtils.rename(currentName, newName);

        return {
            success,
            message: success ? "Success" : "Failed"
        };
    }
    catch (err) {
        console.log("[!] Error renaming file: " + err + "\n");
        throw Response.ERROR.INTERNAL_SERVER;
    };
};

const ResourcesModule = {
    getData,
    unlink,
    rename
};

export default ResourcesModule;

