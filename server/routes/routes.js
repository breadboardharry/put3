const express = require('express');
const router = express.Router();
const Desktop = require('./desktop');
const AccessControl = require('./access-control');

router.use('/desktop', Desktop);
router.use('/access-control', AccessControl);

module.exports = router;
