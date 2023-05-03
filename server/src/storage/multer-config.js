import multer from "multer";
import path from "path";
import utils from "../utils/utils.js";

const allowedFileTypes = /jpeg|jpg|png|gif|mp3|m4a|wma|wav/;
const uploadFolder = {
    images: ["jpeg", "jpg", "png", "gif"],
    audio: ["mp3", "m4a", "wma", "wav"],
};

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get file extension
        const fileExt = utils.getFileExtension(file.originalname);

        // Get the corresponding upload folder
        let uploadPath = "";

        if (uploadFolder.images.includes(fileExt)) uploadPath = "public/images";
        else if (uploadFolder.audio.includes(fileExt))
            uploadPath = "public/audio";
        else
            return cb(
                new Error(`Undefined upload folder for .${fileExt} file`)
            );

        // Create directory if it doesn't exist
        require("fs").mkdir(uploadPath, { recursive: true }, (err) => {
            cb(err, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        cb(null, filename(file));
    },
});

// Desktop image storage
const desktopImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Upload the image in assets folder
        cb(null, "public/assets/");
    },
    filename: (req, file, cb) => {
        cb(null, filename(file, "desktop"));
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    // Check extension
    const filetypes = req.filetypes || allowedFileTypes;
    const validExt = filetypes.test(utils.getFileExtension(file.originalname));
    // Check mime
    // const mimetype = filetypes.test(file.mimetype);

    if (validExt) return cb(null, true);
    return cb(new Error("Only " + filetypes + " files are allowed."));
};

// Generate a custom filename
const filename = (file, config = "none") => {
    let filename;

    switch (config) {
        case "timestamp":
            filename =
                Date.now() + path.extname(file.originalname).toLowerCase();
            break;

        case "desktop":
            filename =
                "desktop" + path.extname(file.originalname).toLowerCase();
            break;

        case "original":
        case "none":
        default:
            filename = file.originalname;
            break;
    }

    return filename;
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
