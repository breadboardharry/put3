const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

/* --------------------------------- STORAGE -------------------------------- */

// Define the storage location for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop();
        cb(null, 'default-desktop.' + extension);
    }
});

const upload = multer({ storage: storage });

/* --------------------------------- ROUTES --------------------------------- */

// Image upload
router.post('/set', upload.single('image'), (req, res) => {
    console.log(req.body)
    // Upload via body
    if (req.body.image) {
        const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
        const bufferData = Buffer.from(base64Data, 'base64');
        const fileName = `default-desktop.jpg`;
        const filePath = path.join('./uploads', fileName);

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
    const filename = req.params.filename || 'default-desktop.jpg';
    res.sendFile(filename, { root: './uploads/' });
});

module.exports = router;