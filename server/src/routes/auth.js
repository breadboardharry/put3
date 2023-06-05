import express from 'express';
import AuthMiddleware from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

/* --------------------------------- ROUTES --------------------------------- */

router.post('/login', (req, res) => {
    const { code } = req.body;

    if (code == process.env.MASTER_CODE) {
        const token = jwt.sign({ user: 'master' }, 'your-secret-key', { expiresIn: '1h' });

        return res.cookie('token', token, {
            maxAge: 3600000,
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
router.get('/islogged', AuthMiddleware, (req, res) => {
    res.json({
        success: true
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
