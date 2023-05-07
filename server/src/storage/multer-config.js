import multer from "multer";
import path from "path";
import fs from "fs";
import StorageUtils from "../modules/storage/utils.js";
import paths from "../enums/paths.js";
import ResourcesUtils from "../modules/resources/utils.js";

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get file extension
        const fileExt = StorageUtils.getFileExtension(file.originalname);

        // Get the corresponding upload folder
        let uploadPath;
        try {
            uploadPath = path.join(paths.RESOURCES, ResourcesUtils.extToDir(fileExt));
        }
        catch (err) {
            return cb(new Error(`Undefined upload folder for .${fileExt} file`));
        }

        // Create directory if it doesn't exist
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            cb(err, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        cb(null, StorageUtils.generateFilename(file.originalname, "clean"));
    },
});

// Desktop image storage
const desktopImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Upload the image in assets folder
        cb(null, "public/assets/");
    },
    filename: (req, file, cb) => {
        cb(null, StorageUtils.generateFilename(file.originalname, "desktop"));
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    // Check extension
    const fileExt = StorageUtils.getFileExtension(file.originalname);
    const validExt = ResourcesUtils.isValidExt(fileExt);

    // Check mime
    // const mimetype = filetypes.test(file.mimetype);

    if (validExt) return cb(null, true);
    return cb(new Error("Only " + filetypes + " files are allowed."));
};

// Create multer object
const upload = {
    file: multer({
        storage: storage,
        // File filter
        fileFilter: fileFilter,
    }),
    desktopImage: multer({
        storage: desktopImageStorage,
        // File filter
        fileFilter: fileFilter,
    }),
};

export default upload;
