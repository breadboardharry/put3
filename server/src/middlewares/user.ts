import { Request, Response } from 'express';
import AdminModule from '../modules/admin/admin';

export default function UserMiddleware(req: Request, res: Response, next: any) {
    const token = req.cookies?.token;
    if (!token) {
        req['user'] = {
            isAdmin: false
        };
        return next();
    }

    AdminModule.isLogged(token).then((logged: boolean) => {
        req['user'] = {
            isAdmin: logged
        };
        return next();
    });
};