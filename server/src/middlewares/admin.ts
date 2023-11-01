import { Request, Response } from 'express';

export default function IsAdminMiddleware(req: Request, res: Response, next: any) {
    const auth = req['auth'];
    if (!auth || !auth.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
    next();
};