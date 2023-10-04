import express, { Request, Response } from 'express';
const router = express.Router();

// router.use('/desktop', Desktop);
// router.use('/auth', Auth);
// router.use('/resources', AuthMiddleware, Resources);

router.use('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to PUT3 API!');
});

export default router;