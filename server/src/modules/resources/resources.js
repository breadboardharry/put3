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

const unlink = (filespath) => {
    // Check input
    try {
        if (!Utils.isArrayOf("string", filespath)) throw 1;

        filespath = filespath.map((filepath) => {
            // Convert to absolute path
            return path.join(Paths.RESOURCES, filepath);
        });
    }
    catch (err) {
        throw Response.ERROR.INVALID_PARAMS;
    };

    // Delete files
    try {
        const count = Storage.deleteFiles(filespath);

        return {
            success: count.affected > 0,
            message: count.affected + " file(s) deleted",
            ...count
        };
    }

    // Normal process error
    catch (err) {
        console.log("[!] Error getting ressources data: " + err + "\n");
        throw Response.ERROR.INTERNAL_SERVER;
    };
};

const rename = (currentName, newName, dirpath) => {
    // Check parameters type
    if (typeof(currentName) !== "string" || typeof(newName) !== "string") {
        throw Response.ERROR.INVALID_PARAMS;
    }

    try {
        // Remove spaces
        newName = StorageUtils.removeSpaces(newName);
    }
    catch (err) {
        console.log("[!] Error renaming file: " + err + "\n");
        throw Response.ERROR.INTERNAL_SERVER;
    };

    // Check if filenames are empty
    if (!currentName || !newName) {
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
    // Check if a file with the same name, at the same location already exists
    if (ResourcesUtils.doFileExists(newName)) {
        throw Response.ERROR.FILE_ALREADY_EXISTS;
    }

    try {
        const success = ResourcesUtils.rename(currentName, newName, dirpath);

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

