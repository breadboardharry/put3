import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Paths } from '../enums/paths';
import { getFileExtension } from './file.service';
import {
    extToDir,
    extToType,
    generateFilename,
    isValidExt,
} from './resource-file.service';
import { FileRef } from '../providers/file-reference';

// Configure storage
const storage = multer.diskStorage({
    destination: (_r, file, cb) => {
        // Get file extension
        const fileExt = getFileExtension(file.originalname);

        // Get the corresponding upload folder
        let uploadPath;
        try {
            uploadPath = path.join(Paths.RESOURCES, extToDir(fileExt));
        } catch (err) {
            return cb(
                new Error(`Undefined upload folder for .${fileExt} file`),
                ''
            );
        }

        // Create directory if it doesn't exist
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            cb(err, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        // Get file extension
        const fileExt = getFileExtension(file.originalname);

        // Get the corresponding upload folder
        let uploadPath;
        try {
            uploadPath = path.join(Paths.RESOURCES, extToDir(fileExt));
        } catch (err) {
            return cb(
                new Error(`Undefined upload folder for .${fileExt} file`),
                ''
            );
        }

        const newFilename = generateFilename(file.originalname, 'uuid');


        const absolutePath = path.join(process.cwd(), uploadPath, newFilename);

        // Add file reference to the request context
        if (!Array.isArray(req.context.storage)) req.context.storage = [];
        req.context.storage.push(new FileRef(absolutePath, extToType(fileExt)));

        cb(null, newFilename);
    },
});

// Desktop image storage
const desktopImageStorage = multer.diskStorage({
    destination: (_r, _f, cb) => {
        // Upload the image in assets folder
        cb(null, 'public/images/');
    },
    filename: (_r, file, cb) => {
        cb(null, generateFilename(file.originalname, 'desktop'));
    },
});

// File filter
const fileFilter = (_r, file, cb) => {
    // Check extension
    const fileExt = getFileExtension(file.originalname);
    const validExt = isValidExt(fileExt);

    // Check mime
    // const mimetype = filetypes.test(file.mimetype);

    if (validExt) return cb(null, true);
    return cb(new Error('File extension not allowed.'));
};

// Create multer object
export const upload = {
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
