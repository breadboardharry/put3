import { Paths } from "../enums/paths";
import path from "path";
import fs from "fs";
import { EnumResourceDirectory } from "../enums/resources";
import { dirToType, getData, isValidType, typeToDir } from "./resource-file.service";

export function renameFile(currentName: string, newName: string, dirpath: string): boolean {
    const currentPath = path.join(Paths.RESOURCES, dirpath, currentName);
    const newPath = path.join(Paths.RESOURCES, dirpath, newName);

    // Check if the file exists
    if (!fs.existsSync(currentPath)) return false;

    try {
        fs.renameSync(currentPath, newPath);
        return true;
    }
    catch (err) {
        console.log("[!] Error renaming file: " + currentPath + "\n" + err + "\n");
        return false;
    }
}

export function deleteFile(filepath: string): boolean {
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

export function deleteFiles(filespath: string[]): { affected: number, failed: number } {
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
 * @param dirpath Directory path
 * @returns List of filenames
 */
export function getFileList(dirpath: string, dirname = ''): string[] {
    let files: string[] = [];
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
 * @param filepath File path
 * @returns True if the file exists
 */
export function fileExists(filepath: string): boolean {
    return fs.existsSync(filepath);
};

/**
 * Get all directories in the resources folder
 * @returns Directories names
 */
export function getDirectories(): string[] {
    const dirs: string[] = [];

    fs.readdirSync(Paths.RESOURCES).forEach((dir) => {
        dirs.push(dir);
    });

    return dirs;
};

/**
 * Get the data from all files in a resource directory
 * @param dirname Directory name
 * @returns Files data
 */
export function getFilesData(dirname: EnumResourceDirectory) {
    const dirpath = path.join(Paths.RESOURCES, dirname);

    return getFileList(dirpath).map((file) => {
        return getFileData(dirToType(dirname), file);
    });
};

/**
 * Get the data from a file
 * @param type Resource type
 * @param file File name
 * @param dirpath Directory path
 * @returns File data
 * @throws If the resource type is not valid
 */
export function getFileData(type, file) {
    // If type is not a valid resource type
    if (!isValidType(type)) throw new Error("Invalid resource type");

    // Get data from the file
    return getData(path.join(typeToDir(type), file), type);
};