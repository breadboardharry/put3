import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export class AuthModule {

    private static loginDuration = {
        millis: 3600000,
        text: '1h'
    };

    /**
     * Login a user
     * @param code The code to login with
     * @returns An object containing a success, a token, and a duration property
     * @example login('valid-code') => { success: true, token: '...', expiresIn: 3600000 }
     * @example login('wrong-code') => { success: false, token: '', expiresIn: 0 }
     */
    public static login(code: string): { success: boolean, token?: string, expiresIn?: number }  {
        const isValidCode = code == env.MASTER_CODE;
        if (!isValidCode) return { success: false };

        const token = jwt.sign({ user: 'master' }, secretKey, { expiresIn: this.loginDuration.text });
        return {
            success: isValidCode,
            expiresIn: this.loginDuration.millis,
            token
        };
    };

    /**
     * Check if a user is logged in via token
     * @param token The user token to check
     * @returns True if logged in, false otherwise
     */
    public static isLogged(token: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                if (!token) return resolve(false);

                jwt.verify(token, secretKey, (err) => {
                    if (err) return resolve(false);
                    return resolve(true);
                });
            }
            catch (err) {
                console.log(err);
                return resolve(false);
            }
        });
    };

};

export const secretKey = 'd2#D9E&5w9k&&%3Ec84NxC25hu@HT#v9';