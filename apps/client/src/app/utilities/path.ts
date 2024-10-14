/**
 * Returns the extension of the path
 * @param path Path to get the extension from
 * @returns Extension of the path without the dot
 * @example extname('file.txt') -> 'txt'
 */
const extname = (path: string): string => {
    return path.split('.').pop() || '';
};

/**
 * Returns the last portion of a path
 * @param path Path to get the basename from
 * @param suffix Suffix to remove from the path
 * @returns Last portion of the path
 * @example basename('path/to/file.txt') -> 'file.txt'
 * @example basename('path/to/file.txt', '.txt') -> 'file'
 */
const basename = (path: string, suffix?: string): string => {
    const base = path.split('/').pop();
    if (!base) return '';
    return suffix ? base.replace(suffix, '') : base;
};

export default { extname, basename };
