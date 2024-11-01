/**
 * Download a file
 * @param file File to download
 * @param filename Name of the file
 */
const download = (file: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
};

export { download };
