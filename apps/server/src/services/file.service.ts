import path from 'path';

export function getPathElem(filepath: string, index: number): string {
    return filepath.split('\\')[index];
}

export function getDirPath(filepath: string): string {
    return filepath.split('\\').slice(0, -1).join('\\');
}

export function removeSpaces(str: string) {
    return str.replace(/\s/g, '');
}

export function getFilename(filepath: string): string {
    return removeFileExtension(getLastPathElement(filepath));
}

export function getLastPathElement(filepath: string): string {
    return path.basename(filepath).trim();
}

export function removeFileExtension(filename: string): string {
    return filename.split('.').slice(0, -1).join('.').trim();
}

// Get a file extension without the dot
export function getFileExtension(filename: string): string {
    return path.extname(filename).split('.').pop()!.toLowerCase();
}

export function getBase64FileExtension(base64: string): string | undefined {
    switch (base64.charAt(0)) {
        case '/':
            return 'jpg';
        case 'i':
            return 'png';
        case 'R':
            return 'gif';
        case 'U':
            return 'webp';
        default:
            return undefined;
    }
}
