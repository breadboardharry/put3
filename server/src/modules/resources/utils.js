import fs from "fs";
import path from "path";
import paths from "../../enums/paths.js";
import Resource from "../../enums/resources.js";
import data from "./data.js";
import Storage from "../storage/storage.js";
import StorageUtils from "../storage/utils.js";
import StorageModule from "../storage/storage.js";

/**
 * Check if a file exists
 * @param {string} filename File name
 * @returns {boolean} True if the file exists
 */
const doFileExists = (filename) => {
    const ext = StorageUtils.getFileExtension(filename);
    const filepath = path.join(paths.RESOURCES, extToDir(ext), filename);

    return Storage.fileExists(filepath);
};

/**
 * Rename a resource file
 * @param {string} currentName Current file name
 * @param {string} newName New file name
 * @returns {boolean} True if the file has been renamed
 */
const rename = (currentName, newName, dirpath) => {
    dirpath = path.join(paths.RESOURCES, dirpath);

    return Storage.renameFile(currentName, newName, dirpath);
}

/**
 * Check if a resource type is valid
 * @param {string} type Resource type
 * @returns {boolean} True if the resource type is valid
 */
const isValidType = (type) => {
    return Object.values(Resource.TYPE).includes(type);
};

/**
 * Check if a file extension is valid
 * @param {string} ext File extension
 * @returns {boolean} True if the extension is valid
 */
const isValidExt = (ext) => {
    return Object.values(Resource.EXTENSIONS).flat().includes(ext);
};

/**
 * Get resource file type from its extension
 * @param {string} ext File extension
 * @returns {string} Resource type*
 * @throws {Error} If the extension is not valid
 */
const extToType = (ext) => {
    // Check if the extension is valid
    if (!isValidExt(ext)) throw new Error("Invalid extension");

    // Get the resource type
    for (let [type, exts] of Object.entries(Resource.EXTENSIONS)) {
        if (exts.includes(ext)) return type;
    }
};

/**
 * Get resource directory name from an extension
 * @param {string} ext File extension
 * @returns {string} Directory name
 * @throws {Error} If the extension is not valid
 */
const extToDir = (ext) => {
    const type = extToType(ext);
    return typeToDir(type);
};

/**
 * Check if a directory name is valid
 * @param {string} dirname Directory name
 * @returns {boolean} True if the directory name is valid
 */
const isValidDir = (dirname) => {
    return (
        typeof dirname == "string" && fs.existsSync(path.join(paths.RESOURCES, dirname))
    );
};

/**
 * Converts a directory name to a resource type
 * @param {string} name Directory name
 * @returns {string} Resource type
 * @throws {Error} If the directory name is not a valid resource type
 */
const dirToType = (dirname) => {
    switch (dirname) {
        case "images":
            return Resource.TYPE.Image;
        case "videos":
            return Resource.TYPE.Video;
        case "audio":
            return Resource.TYPE.Audio;
        default:
            throw new Error("Invalid directory name");
    }
};

/**
 * Converts a resource type to a directory name
 * @param {string} type Resource type
 * @returns {string} Directory name
 * @throws {Error} If the resource type is not valid
 */
const typeToDir = (type) => {
    switch (type) {
        case Resource.TYPE.Image:
            return "images";
        case Resource.TYPE.Video:
            return "videos";
        case Resource.TYPE.Audio:
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

    return StorageModule.getFileList(dirpath).map((file) => {
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
    if (!isValidType(type)) throw new Error("Invalid resource type");

    // Get data from the file
    return data.getData(path.join(typeToDir(type), file), type);
};

const ResourcesUtils = {
    dirToType,
    typeToDir,
    extToType,
    extToDir,
    isValidExt,
    getDirectories,
    getFilesData,
    getFileData,
    isValidDir,
    rename,
    doFileExists,
    isValidType
};

export default ResourcesUtils;
