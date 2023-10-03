import fs from "fs";
import path from "path";

const renameFile = (currentName, newName, dirpath) => {
    const currentPath = path.join(dirpath, currentName);
    const newPath = path.join(dirpath, newName);

    // Check if the file exists
    if (!fs.existsSync(currentPath)) return false;

    // Rename the file
    try {
        fs.renameSync(currentPath, newPath);
        return true;
    }
    catch (err) {
        console.log("[!] Error renaming file: " + currentPath + "\n" + err + "\n");
        return false;
    }
}

const deleteFile = (filepath) => {
    // Check if the file exists
    if (!fs.existsSync(filepath)) return false;

    // Delete the file
    try {
        fs.unlinkSync(filepath);
        return true;
    }
    catch (err) {
        console.log("[!] Error deleting file: " + filepath + "\n" + err + "\n")
        return false
    }
};

const deleteFiles = (filespath) => {
    const count = {
        affected: 0,
        failed: 0
    };

    // Delete each file
    for (let filepath of filespath) {
        if (deleteFile(filepath)) count.affected++;
        else count.failed++;
    }

    return count;
};

/**
 * Get a list of all files in a directory
 * @param {string} dirpath Directory path
 * @returns {string[]} List of filenames
 */
const getFileList = (dirpath, dirname = '') => {
    let files = [];
    const items = fs.readdirSync(path.join(dirpath, dirname), { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            files = [
                ...files,
                ...(getFileList(dirpath, path.join(dirname, item.name))),
            ];
        }
        else files.push(path.join(dirname, item.name));
    }

    return files;
};

/**
 * Check if a file exists
 * @param {string} filepath File path
 * @returns {boolean} True if the file exists
 */
const fileExists = (filepath) => {
    return fs.existsSync(filepath);
};

const StorageModule = {
    deleteFiles,
    deleteFile,
    renameFile,
    getFileList,
    fileExists
};

export default StorageModule;
