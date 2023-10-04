import express from 'express';
const router = express.Router();
import Desktop from './desktop';
import Resources from './resources';
import Auth from './auth';
import AuthMiddleware from '../../../middlewares/auth';

router.use('/desktop', Desktop);
router.use('/auth', Auth);
router.use('/resources', AuthMiddleware, Resources);

router.use('/', (req, res) => {
    res.status(200).send('Welcome to PUT3 API!');
})

export default router;