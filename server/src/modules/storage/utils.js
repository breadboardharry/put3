const removeFileExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.').trim();
};

// Get a file extension without the dot
const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
};

const StorageUtils = {
    removeFileExtension,
    getFileExtension
};

export default StorageUtils;
