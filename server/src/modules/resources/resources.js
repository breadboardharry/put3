import fs from "fs";
import path from "path";
import utils from "./utils.js";
import paths from "../../enums/paths.js";
import ResourcesUtils from "./utils.js";

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

const ResourcesModule = {
    getData
};

export default ResourcesModule;

