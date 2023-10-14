import express from 'express';
import { SessionService } from '../../../services/users/sessions.service';
import IsAdminMiddleware from '../../../middlewares/admin';
const router = express.Router();

router.get('/', IsAdminMiddleware, (req, res) => {
    const sessions = SessionService.getAll();
    return res.status(200).json({ success: true, sessions: sessions });
});

router.get('/exists', (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(200).json({ success: false, message: 'Missing code' });

    const session = SessionService.find(code as string);
    if (session) return res.status(200).json({ success: true });

    // Delay to avoid brute force
    setTimeout(() => {
        return res.status(200).json({ success: false });
    }, 2000);
});

export default router;
