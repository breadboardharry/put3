const express = require('express');
const router = express.Router();
const upload = require('./../storage/multer-config');

// Upload file
router.post('/', upload.file.single('file'), function(req, res, next) {
  res.json({ message: 'File uploaded successfully!' });
});

module.exports = router;
