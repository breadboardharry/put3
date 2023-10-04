import { Request, Response } from 'express';
import { AuthModule } from '../modules/auth/auth';

export default function AuthMiddleware(req: Request, res: Response, next: any) {
    const token = req.cookies.token;

    AuthModule.isLogged(token).then((logged: boolean) => {
        if (!logged) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return next();
    });
};