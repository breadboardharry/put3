const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const upload = require('./../storage/multer-config');

// Upload file
router.post('/upload', upload.file.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully!' });
});

// Get all images as json object
router.get('/images', (req, res) => {
  const imagesPath = './public/images';

  try {
    const files = fs.readdirSync(imagesPath);

    const images = files.map((file) => {
      const filePath = path.join(imagesPath, file);
      const dimensions = sizeOf(filePath);

      return {
        name: file,
        url: `images/${file}`,
        type: dimensions.type,
        size: fs.statSync(filePath).size,
        dimensions: {
          width: dimensions.width,
          height: dimensions.height
        }
      };
    });

    res.status(200).json(images);
  }
  catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
