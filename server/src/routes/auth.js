import express from 'express';
import AuthModule from '../modules/auth/auth.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

/* --------------------------------- ROUTES --------------------------------- */

router.post('/login', (req, res) => {
    const { code } = req.body;
    const login = AuthModule.login(code);

    if (login.success) {
        return res.cookie('token', login.token, {
            maxAge: login.millis,
            httpOnly: true
        }).json({
            success: true,
            message: "Logged in successfully!"
        });
    }

    res.json({
        success: false
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
        console.log("logged");
        console.log(logged);
        res.json({
            logged
        });
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
            res.status(200).json(process.env.MASTER_CODE.length);
            break;

        default:
            res.status(400).json({ error: 'Invalid code name' });
            break;
    }
});

export default router;
