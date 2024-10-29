import iconv from 'iconv-lite';
import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';
import {
    getDirPath,
    getFileExtension,
    getLastPathElement,
    getPathElem,
} from './file.service';
import { fileExists, renameFile } from './resource.service';
import { Paths } from '../enums/paths';
import {
    EnumResourceDirectory,
    EnumResourceType,
} from '../app-models/enums/resources';
import { v4 as uuidv4 } from 'uuid';

const Extensions = {
    images: ['jpg', 'jpeg', 'png', 'gif'],
    videos: ['mp4', 'mov', 'avi', 'mkv'],
    audios: ['mp3', 'wav'],
};

// Generate a custom filename
export function generateFilename(
    filename: string,
    config:
        | 'timestamp'
        | 'uuid'
        | 'desktop'
        | 'clean'
        | 'original'
        | 'none' = 'none'
): string {
    const ext = path.extname(filename);
    switch (config) {
        case 'timestamp':
            filename = Date.now() + ext.toLowerCase();
            break;

        case 'uuid':
            filename = uuidv4() + ext.toLowerCase();
            break;

        case 'desktop':
            filename = 'desktop' + ext.toLowerCase();
            break;

        case 'clean':
            // Convert accented characters to their unaccented version
            filename = filename
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            // Remove non-ASCII characters
            filename = filename.replace(/[^\x00-\x7F]/g, '');
            // Encode in utf8
            filename = iconv.decode(iconv.encode(filename, 'latin1'), 'utf8');
            break;

        case 'original':
        case 'none':
        default:
            filename = filename;
            break;
    }

    return filename;
}

/**
 * Get resource directory name from a file extension
 * @param ext File extension
 * @returns Directory name
 * @throws If the extension is not valid
 */
export function extToDir(ext: string): string {
    const type = extToType(ext);
    return typeToDir(type);
}

/**
 * Check if a directory name is valid
 * @param dirname Directory name
 * @returns True if the directory name is valid
 */
export function isValidDir(dirname: string): boolean {
    return (
        typeof dirname == 'string' &&
        fs.existsSync(path.join(Paths.RESOURCES, dirname))
    );
}

/**
 * Converts a directory name to a resource type
 * @param name Directory name
 * @returns Resource type
 * @throws If the directory name is not associated to a valid resource type
 */
export function dirToType(dirname: EnumResourceDirectory): EnumResourceType {
    switch (dirname) {
        case EnumResourceDirectory.IMAGES:
            return EnumResourceType.IMAGE;
        case EnumResourceDirectory.VIDEOS:
            return EnumResourceType.VIDEO;
        case EnumResourceDirectory.AUDIOS:
            return EnumResourceType.AUDIO;
        default:
            throw new Error('Invalid directory name');
    }
}

/**
 * Converts a resource type to a directory name
 * @param type Resource type
 * @returns Directory name
 * @throws If the resource type is not valid
 */
export function typeToDir(type: EnumResourceType): EnumResourceDirectory {
    switch (type) {
        case EnumResourceType.IMAGE:
            return EnumResourceDirectory.IMAGES;
        case EnumResourceType.VIDEO:
            return EnumResourceDirectory.VIDEOS;
        case EnumResourceType.AUDIO:
            return EnumResourceDirectory.AUDIOS;
        default:
            throw new Error('Invalid resource type');
    }
}

/**
 * Get resource file type from its extension
 * @param ext File extension
 * @returns Resource type*
 * @throws If the extension is not valid
 */
export function extToType(ext: string): EnumResourceType {
    // Check if the extension is valid
    if (!isValidExt(ext)) throw new Error('Invalid extension');

    // Get the resource type
    for (const [type, exts] of Object.entries(Extensions)) {
        if (exts.includes(ext)) {
            return dirToType(type as EnumResourceDirectory);
        }
    }
    throw new Error('Invalid extension');
}

/**
 * Check if a file exists
 * @param filename File name
 * @returns True if the file exists
 */
export function doFileExists(filename: string): boolean {
    const ext = getFileExtension(filename);
    const filepath = path.join(Paths.RESOURCES, extToDir(ext), filename);
    return fileExists(filepath);
}

/**
 * Rename a resource file
 * @param currentName Current file name
 * @param newName New file name
 * @returns True if the file has been renamed
 */
export function rename(currentName: string, newName: string, dirpath: string) {
    dirpath = path.join(Paths.RESOURCES, dirpath);

    return renameFile(currentName, newName, dirpath);
}

/**
 * Check if a resource type is valid
 * @param type Resource type
 * @returns True if the resource type is valid
 */
export function isValidType(type) {
    return Object.values(EnumResourceType).includes(type);
}

/**
 * Check if a file extension is valid
 * @param ext File extension
 * @returns True if the extension is valid
 */
export function isValidExt(ext: string): boolean {
    return Object.values(Extensions).flat().includes(ext);
}

export function getData(filepath: string, filetype?: EnumResourceType) {
    const type = filetype ? filetype : getPathElem(filepath, 0);

    switch (type) {
        case EnumResourceType.IMAGE:
            return getImageData(filepath);
        case EnumResourceType.VIDEO:
            return getVideoData(filepath);
        case EnumResourceType.AUDIO:
            return getAudioData(filepath);
        default:
            throw new Error('Invalid resource type');
    }
}

/**
 * Get general data from a resource file
 * @param filepath File path (relative to the resources directory) e.g. "images/../image.jpg"
 */
export function getGeneralData(filepath: string) {
    const publicPath = path.join('resources', filepath);
    const absolutePath = path.join('public', publicPath);

    return {
        name: getLastPathElement(filepath),
        extension: getFileExtension(filepath),
        href: publicPath,
        path: filepath,
        dirpath: getDirPath(filepath),
        size: fs.statSync(absolutePath).size,
    };
}

/**
 * Get resource data from an image file
 * @param filepath File path (relative to the resources directory) e.g. "images/../image.jpg"
 */
export function getImageData(filepath: string) {
    const generalData = getGeneralData(filepath);
    const dimensions = sizeOf(path.join('public', generalData.href));
    if (!dimensions) throw new Error('Invalid image file');

    return {
        ...generalData,
        type: 'image',
        extension: dimensions.type,
        dimensions: {
            width: dimensions.width,
            height: dimensions.height,
            ratio: dimensions.width! / dimensions.height!,
        },
    };
}

/**
 * Get resource data from a video file
 * @param filepath File path (relative to the resources directory) e.g. "videos/../video.mp4"
 */
export function getVideoData(filepath: string) {
    return {
        ...getGeneralData(filepath),
        type: 'video',
    };
}

/**
 * Get resource data from an audio file
 * @param filepath File path (relative to the resources directory) e.g. "audio/../audio.mp3"
 */
export function getAudioData(filepath: string) {
    return {
        ...getGeneralData(filepath),
        type: 'audio',
    };
}
