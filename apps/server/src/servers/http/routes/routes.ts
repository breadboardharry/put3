import express, { Router } from 'express';
const router: Router = express.Router();
import Admin from './admin';
import Resources from './medias';
import Desktop from './desktop';
import Session from './session';

router.use('/session', Session);
router.use('/desktop', Desktop);
router.use('/admin', Admin);
router.use('/resources', Resources);

router.use('/', (_r, res) => {
    res.status(200).send('Welcome to PUT3 API!');
});

export default router;
