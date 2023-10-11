import express from 'express';
import { AuthModule } from '../../auth/auth';
import { env } from '../../../config/env';
const router = express.Router();

/* --------------------------------- ROUTES --------------------------------- */

router.post('/login', (req, res) => {
    const { code } = req.body;
    const login = AuthModule.login(code);

    if (!login.success) return res.json({ success: false });

    return res.cookie('token', login.token, {
        maxAge: login.expiresIn,
        httpOnly: true
    }).json({
        success: true,
        message: "Logged in successfully!"
    });
});

/**
 * Check if the user is logged in
 * @description This route is protected by the AuthMiddleware
 * @returns A JSON object with a success property
*/
router.get('/islogged', (req, res) => {
    const token = req.cookies.token;

    AuthModule.isLogged(token).then((logged) => {
        res.json({ logged });
    });
});

/**
 * Get the length of a code
 * @param codeName Route parameter - specifies the code to verify
 * @returns The length of the code
 */
router.get('/codelen/:codeName', (req, res) => {
    const codeName = req.params.codeName;

    switch (codeName) {
        case 'master':
            res.status(200).json(env.MASTER_CODE.length);
            break;

        default:
            res.status(400).json({ error: 'Invalid code name' });
            break;
    }
});

router.get('/logout', (req, res) => {
    console.log('logout');
    res.clearCookie('token');
    res.json({ success: true });
});

export default router;
