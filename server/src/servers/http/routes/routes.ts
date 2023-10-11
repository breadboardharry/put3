import express, { Request, Response } from 'express';
const router = express.Router();
import Admin from './admin';
import Resources from './resources';
import Desktop from './desktop';
import Session from './session';

router.use('/session', Session);
router.use('/desktop', Desktop);
router.use('/admin', Admin);
router.use('/resources', Resources);

router.use('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to PUT3 API!');
});

export default router;