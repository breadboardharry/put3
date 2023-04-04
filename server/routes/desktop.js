const express = require('express');
const router = express.Router();
const multer = require('multer');

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
    res.status(200).json({
        message: 'Image uploaded successfully',
        filename: req.file.originalname
    });
});

// Get the image
router.get('/get', (req, res) => {
    const filename = req.params.filename || 'default-desktop.jpg';
    res.sendFile(filename, { root: './uploads/' });
});

module.exports = router;