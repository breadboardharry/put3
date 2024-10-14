import express, { Router } from 'express';
import { SessionService } from '../../../services/users/sessions.service';
import IsAdminMiddleware from '../../../middlewares/admin';
import {
    ERROR,
    SUCCESS,
    internalError,
    reply,
} from '../../../services/response.service';
const router: Router = express.Router();

router.get('/', IsAdminMiddleware, (_, res) => {
    try {
        const sessions = SessionService.getAll();
        reply(res, { ...SUCCESS.DEFAULT, data: sessions });
    } catch (err: any) {
        internalError(res, err);
    }
});

router.get('/exists', (req, res) => {
    try {
        const { code } = req.query;
        if (!code)
            return reply(res, { ...ERROR.INVALID_PARAMS, message: 'No code' });

        const session = SessionService.find(code as string);
        if (session) return reply(res, { ...SUCCESS.DEFAULT, data: true });

        // Delay to avoid brute force
        setTimeout(() => {
            return reply(res, { ...SUCCESS.DEFAULT, data: false });
        }, 2000);
    } catch (err: any) {
        internalError(res, err);
    }
});

export default router;
