export function isArrayOf(type: string, array: any[], notNull = false): boolean {
    if (!Array.isArray(array)) return false;

    for (let item of array) {
        if (typeof item !== type) return false;
        if (notNull && !item) return false;
    }
    return true;
};