import { Request, Response } from 'express';

export default function IsAdminMiddleware(req: Request, res: Response, next: any) {
    const user = req['user'];
    if (!user || !user.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
    next();
};