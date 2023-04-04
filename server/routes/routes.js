const express = require('express');
const router = express.Router();
const Desktop = require('./desktop');

router.use('/desktop', Desktop);

module.exports = router;