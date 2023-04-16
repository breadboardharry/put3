const express = require('express');
const router = express.Router();
const Desktop = require('./desktop');
const AccessControl = require('./access-control');
const Storage = require('./storage');

router.use('/desktop', Desktop);
router.use('/access-control', AccessControl);
router.use('/', Storage);

module.exports = router;
