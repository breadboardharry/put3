import fs from "fs";
import path from "path";

const renameFile = (currentName, newName, dirpath) => {
    const filepath = path.join(dirpath, currentName);
    const newPath = path.join(dirpath, newName);

    // Check if the file exists
    if (!fs.existsSync(filepath)) return false;

    // Rename the file
    try {
        fs.renameSync(filepath, newPath);
        return true;
    }
    catch (err) {
        console.log("[!] Error renaming file: " + filepath + "\n" + err + "\n");
        return false;
    }
}

const deleteFile = (filename, dirpath) => {

    const filepath = path.join(dirpath, filename);

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

const deleteFiles = (filenames, dirname) => {
    const count = {
        success: 0,
        failed: 0
    };

    // Delete each file
    for (let filename of filenames) {
        if (deleteFile(filename, dirname))
            count.success++;
        else count.failed++;
    }

    return count;
};

/**
 * Get a list of all files in a directory
 * @param {string} dirname Directory path
 * @returns {string[]} List of filenames
 */
const getFileList = (dirpath, dirname) => {
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

const StorageModule = {
    deleteFiles,
    deleteFile,
    renameFile,
    getFileList
};

export default StorageModule;
