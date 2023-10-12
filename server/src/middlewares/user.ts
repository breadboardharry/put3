import { Request, Response } from 'express';
import AdminModule from '../modules/admin/admin';

export default function UserMiddleware(req: Request, res: Response, next: any) {
    const token = req.cookies?.token;

    if (!token) {
        req['auth'] = {
            isAdmin: false
        };
        return next();
    }

    AdminModule.isLogged(token).then((logged: boolean) => {
        req['auth'] = {
            isAdmin: logged
        };
        return next();
    });
};