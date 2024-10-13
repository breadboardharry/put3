import fs from 'fs';
import path from 'path';
import { doFileExists, isValidDir } from '../../services/resource-file.service';
import { Response } from '../../services/response.service';
import { Paths } from '../../enums/paths';
import { getFileExtension, removeSpaces } from '../../services/file.service';
import * as ResourceService from '../../services/resource.service';
import { isArrayOf } from '../../services/type.service';
import { EnumResourceDirectory, EnumResourceType } from '../../app-models/enums/resources';

export function getData(dirname?: string) {
    // Check if the directory is valid
    if (dirname && !isValidDir(dirname)) {
        throw Response.ERROR.INVALID_DIRNAME;
    }

    try {
        const dirnames = dirname ? [dirname] : ResourceService.getDirectories();
        let files = {};

        for (const dirname of dirnames) {
            const dirpath = path.join(Paths.RESOURCES, dirname);

            // Check if the directory exists
            if (!fs.existsSync(dirpath)) throw new Error('Directory not found');

            // For each file in the directory, get the file info
            const data = ResourceService.getFilesData(dirname as EnumResourceDirectory);
            dirnames.length > 1 ? (files[dirname] = data) : (files = data);
        }

        return files;
    } catch (err) {
        // Normal process error
        console.error('[!] Error getting ressources data: ' + err + '\n');
        throw Response.ERROR.INTERNAL_SERVER;
    }
}

export function unlink(filespath) {
    // Check input
    try {
        if (!isArrayOf('string', filespath)) throw 1;

        filespath = filespath.map((filepath) => {
            // Convert to absolute path
            return path.join(Paths.RESOURCES, filepath);
        });
    } catch (err) {
        throw Response.ERROR.INVALID_PARAMS;
    }

    // Delete files
    try {
        const count = ResourceService.deleteFiles(filespath);

        return {
            success: count.affected > 0,
            message: count.affected + ' file(s) deleted',
            ...count,
        };
    } catch (err) {
        // Normal process error
        console.error('[!] Error getting ressources data: ' + err + '\n');
        throw Response.ERROR.INTERNAL_SERVER;
    }
}

export function rename(
    currentName: string,
    newName: string,
    dirpath: string
): boolean {
    // Check parameters type
    if (typeof currentName !== 'string' || typeof newName !== 'string') {
        throw Response.ERROR.INVALID_PARAMS;
    }

    try {
        // Remove spaces
        newName = removeSpaces(newName);
    } catch (err) {
        console.error('[!] Error renaming file: ' + err + '\n');
        throw Response.ERROR.INTERNAL_SERVER;
    }

    // Check if filenames are empty
    if (!currentName || !newName) {
        throw Response.ERROR.INVALID_PARAMS;
    }
    // Check if names are the same
    if (currentName == newName) {
        throw Response.SUCCESS.DEFAULT;
    }
    // Check if file extension is the same
    if (getFileExtension(currentName) !== getFileExtension(newName)) {
        throw Response.ERROR.INVALID_FILE_EXTENSION;
    }
    // Check if a file with the same name, at the same location already exists
    if (doFileExists(newName)) {
        throw Response.ERROR.FILE_ALREADY_EXISTS;
    }

    try {
        const success = ResourceService.renameFile(currentName, newName, dirpath);
        return success;
    } catch (err) {
        console.error('[!] Error renaming file: ' + err + '\n');
        throw Response.ERROR.INTERNAL_SERVER;
    }
}

export function getFileData(type: EnumResourceType, filename: string) {
    return ResourceService.getFileData(type, filename);
}
