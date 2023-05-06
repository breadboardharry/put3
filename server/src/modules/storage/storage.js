import fs from "fs";
import path from "path";

const renameFile = (currentName, newName, type) => {
    const filepath = path.join("./public", type, currentName);
    const newPath = path.join("./public", type, newName);

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

    const filepath = path.join("./public", dirpath, filename);

    console.log(filepath);

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

const StorageModule = {
    deleteFiles,
    deleteFile,
    renameFile
};

export default StorageModule;
