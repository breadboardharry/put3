import express from 'express';
const router = express.Router();
import Desktop from './desktop.js';
import AccessControl from './access-control.js';

router.use('/desktop', Desktop);
router.use('/access-control', AccessControl);

export default router;
