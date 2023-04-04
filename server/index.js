const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;

// Define the storage location for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.').pop();
    cb(null, 'desktop.' + extension);
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Define the POST route for the image upload
app.post('/desktop/set', upload.single('image'), (req, res) => {
  res.status(200).json({
    message: 'Image uploaded successfully',
    filename: req.file.originalname
  });
});

// Define the GET route to serve the uploaded image
app.get('/desktop/get', (req, res) => {
  const filename = req.params.filename || 'desktop.jpg';
  res.sendFile(filename, { root: './uploads/' });
});

app.listen(PORT, () => {
  console.log(`[*] Server started on: http://localhost:${PORT}`)
});