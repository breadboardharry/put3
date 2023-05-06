const Response = {
    "ERROR": {
        "INTERNAL_SERVER": { success: false, message: "Internal server error" },
        "INVALID_PARAMS": { success: false, message: "Invalid parameters" },
        "INVALID_FILE_EXTENSION": { success: false, message: "Invalid file extension" },
        "INVALID_DIRNAME": { success: false, message: "Invalid directory name" },
    },
    "SUCCESS": {
        "DEFAULT": { success: true, message: "Success" },
        "UPLOAD": { success: true, message: "Uploaded successfully" },
    }
};

export default Response;
