import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FileService {

    constructor() {}

    /**
     * Download a file
     * @param file File to download
     * @param filename Name of the file
     */
    public download(file: Blob, filename: string) {
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
    }

    /**
     * Remove the extension from a file name
     * @param filename File name
     * @returns File name without extension
     * @example removeExtension('file.txt') -> 'file'
     */
    public removeExtension(filename: string) {
        return filename.split('.').slice(0, -1).join('.');
    }
}
