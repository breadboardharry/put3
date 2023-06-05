import express from 'express';
const router = express.Router();
import Desktop from './desktop.js';
import Resources from './resources.js';
import Auth from './auth.js';
import AuthMiddleware from '../middlewares/auth.js';

router.use('/desktop', Desktop);
router.use('/auth', Auth);
router.use('/resources', AuthMiddleware, Resources);

export default router;
