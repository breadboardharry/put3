import express from 'express';
const router = express.Router();
import Desktop from './desktop.js';
import AccessControl from './access-control.js';
import Storage from './storage.js';

router.use('/desktop', Desktop);
router.use('/access-control', AccessControl);
router.use('/', Storage);

export default router;
