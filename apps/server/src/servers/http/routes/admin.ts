import express, { Router } from 'express';
import AdminModule from '../../../modules/admin/admin';
import {
    SUCCESS,
    internalError,
    reply,
} from '../../../services/response.service';
const router: Router = express.Router();

router.post('/login', (req, res) => {
    const { code } = req.body;
    const login = AdminModule.login(code);
    if (!login.success)
        return reply(res, {
            ...SUCCESS.DEFAULT,
            success: false,
            message: 'Invalid code!',
        });

    res.cookie('token', login.token, {
        maxAge: login.expiresIn,
        httpOnly: true,
    });
    reply(res, { ...SUCCESS.DEFAULT, message: 'Logged in successfully!' });
});

/**
 * Check if the user is logged in
 * @description This route is protected by the AuthMiddleware
 * @returns A JSON object with a success property
 */
router.get('/islogged', (req, res) => {
    try {
        const auth = req['auth'];
        const isAdmin: boolean = !!auth && auth.isAdmin;
        reply(res, { ...SUCCESS.DEFAULT, data: { isAdmin } });
    } catch (err: any) {
        internalError(res, err);
    }
});

/**
 * Get the length of a code
 * @returns The length of the code
 */
router.get('/codelen', (_, res) => {
    try {
        const codelen = process.env.MASTER_CODE!.length;
        reply(res, { ...SUCCESS.DEFAULT, data: codelen });
    } catch (err: any) {
        internalError(res, err);
    }
});

router.get('/logout', (_, res) => {
    res.clearCookie('token');
    reply(res, SUCCESS.DEFAULT);
});

export default router;
