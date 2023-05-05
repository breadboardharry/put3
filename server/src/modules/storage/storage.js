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
    renameFile
};

export default StorageModule;
