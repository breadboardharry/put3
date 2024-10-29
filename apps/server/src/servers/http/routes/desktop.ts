import express, { Router } from 'express';
const router: Router = express.Router();
import path from 'path';
import { getBase64FileExtension } from '../../../services/file.service';
import { Paths } from '../../../enums/paths';
import { upload } from '../../../services/multer';
import { getLastDesktopImage } from '../../../services/desktop.service';
import {
    ERROR,
    SUCCESS,
    internalError,
    reply,
} from '../../../services/response.service';
import { writeFile } from 'fs/promises';

/* --------------------------------- ROUTES --------------------------------- */

// Image upload
router.post('/set', upload.desktopImage.single('image'), async (req, res) => {
    try {
        if (!req.body.image) return reply(res, ERROR.INVALID_PARAMS);

        const base64Data = req.body.image.replace(
            /^data:image\/\w+;base64,/,
            ''
        );

        const bufferData = Buffer.from(base64Data, 'base64');
        const fileExt = getBase64FileExtension(base64Data);
        const now = new Date();
        const fileName = 'desktop_' + now.getTime() + '.' + fileExt;
        const filePath = path.join(Paths.DESKTOPS, fileName);

        // Write the file
        await writeFile(filePath, bufferData);

        return reply(res, { ...SUCCESS.UPLOAD, data: fileName });
    } catch (err: any) {
        internalError(res, err);
    }
});

// Get the image
router.get('/get', async (_r, res) => {
    try {
        const filename = getLastDesktopImage();
        res.sendFile(filename, { root: Paths.DESKTOPS });
    } catch (err: any) {
        internalError(res, err);
    }
});

export default router;
