import express from 'express';
const router = express.Router();
<<<<<<< dev:server/src/routes/desktop.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
=======
const upload = require('./../storage/multer-config');
const fs = require('fs');
const path = require('path');
>>>>>>> File upload:server/routes/desktop.js

/* --------------------------------- ROUTES --------------------------------- */

// Image upload
router.post('/set', upload.desktopImage.single('image'), (req, res) => {
    // Upload via body
    if (req.body.image) {
        const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
        const bufferData = Buffer.from(base64Data, 'base64');
        const fileName = 'desktop' + path.extname(req.body.filename);
        const filePath = path.join('./public/assets', fileName);

        fs.writeFile(filePath, bufferData, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading image' });
            }

            res.status(200).json({
                message: 'Image uploaded successfully',
                filename: fileName
            });
        });
    }
    // Via form-data
    else if (req.file)
        res.status(200).json({
            message: 'Image uploaded successfully',
            filename: req.file.originalname
        });

    else return res.status(400).json({ error: 'No file uploaded' });
});

// Get the image
router.get('/get', (req, res) => {
    const filename = 'default-desktop.jpg';
    res.sendFile(filename, { root: './public/assets/' });
});

export default router;
