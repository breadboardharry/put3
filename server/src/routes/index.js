import express from 'express';
const router = express.Router();
import Desktop from './desktop.js';
import AccessControl from './access-control.js';
import Resources from './resources.js';

router.use('/desktop', Desktop);
router.use('/access-control', AccessControl);
router.use('/resources', Resources);

export default router;
