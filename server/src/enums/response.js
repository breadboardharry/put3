const Response = {
    "ERROR": {
        "INTERNAL_SERVER": { status: 500, success: false, message: "Internal server error" },
        "INVALID_PARAMS": { status: 400, success: false, message: "Invalid parameters" },
        "INVALID_FILE_EXTENSION": { status: 400, success: false, message: "Invalid file extension" },
        "INVALID_DIRNAME": { status: 400, success: false, message: "Invalid directory name" },
        "FILE_ALREADY_EXISTS": { status: 400, success: false, message: "File already exists" }
    },
    "SUCCESS": {
        "DEFAULT": { status: 200, success: true, message: "Success" },
        "UPLOAD": { status: 200, success: true, message: "Uploaded successfully" },
    }
};

export default Response;
