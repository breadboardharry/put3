import express, { Router } from 'express';
import AdminModule from '../../../modules/admin/admin';
const router: Router = express.Router();

router.post('/login', (req, res) => {
    const { code } = req.body;
    const login = AdminModule.login(code);
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
    const auth = req['auth'];
    res.json({ isAdmin: !!auth && auth.isAdmin });
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
            res.status(200).json(process.env.MASTER_CODE!.length);
            break;

        default:
            res.status(400).json({ error: 'Invalid code name' });
            break;
    }
});

router.get('/logout', (_r, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

export default router;
