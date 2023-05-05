import fs from "fs";
import path from "path";
import paths from "../../enums/paths.js";
import Resource from "../../enums/resources.js";
import data from "./data.js";

const isValidDir = (dirname) => {
    return typeof(dirname) == 'string' && fs.existsSync(path.join(paths.RESOURCES, dirname));
}

/**
 * Converts a directory name to a resource type
 * @param {string} name The directory name
 * @returns {string} The resource type
 * @throws {Error} If the directory name is not a valid resource type
 */
const dirToType = (dirname) => {
    switch (dirname) {
        case "images":
            return "image";
        case "videos":
            return "video";
        case "audio":
            return "audio";
        default:
            throw new Error("Invalid resource type");
    }
};

/**
 * Get all directories in the resources folder
 * @returns {string[]} Directories names
 */
const getDirectories = () => {
    const dirs = [];

    fs.readdirSync(paths.RESOURCES).map((dir) => {
        dirs.push(dir);
    });

    return dirs;
};

/**
 * Get the data from all files in a directory
 * @param {string} dirname Directory name
 * @returns {object[]} Files data
 */
const getFilesData = (dirname) => {
    const dirpath = path.join(paths.RESOURCES, dirname);

    return fs.readdirSync(dirpath).map((file) => {
        return getFileData(ResourcesUtils.dirToType(dirname), file);
    });
};

/**
 * Get the data from a file
 * @param {string} type Resource type
 * @param {string} file File name
 * @param {string} dirpath Directory path
 * @returns {object} File data
 * @throws {Error} If the resource type is not valid
 */
const getFileData = (type, file) => {
    // If type is not a valid resource type
    if (!Object.values(Resource.TYPE).includes(type))
        throw new Error("Invalid resource type");

    // Get the data from the file
    switch (type) {
        case Resource.TYPE.Image: return data.getData.image(file);

        case Resource.TYPE.Video: return data.getData.video(file);

        case Resource.TYPE.Audio: return data.getData.audio(file);

        default: return {};
    }
};

const ResourcesUtils = {
    dirToType,
    getDirectories,
    getFilesData,
    getFileData,
    isValidDir
};

export default ResourcesUtils;
