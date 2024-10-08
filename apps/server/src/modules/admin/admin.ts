import jwt from 'jsonwebtoken';

export default class AdminModule {

    private static loginDuration = {
        millis: 3600000,
        text: '1h'
    };

    /**
     * Login a user as admin
     * @param code The code to login with
     * @returns An object containing a success, a token, and a duration property
     * @example login('valid-code') => { success: true, token: '...', expiresIn: 3600000 }
     * @example login('wrong-code') => { success: false, token: '', expiresIn: 0 }
     */
    public static login(code: string): { success: boolean, token?: string, expiresIn?: number }  {
        const isValidCode = code == (process.env.MASTER_CODE || '0000');
        if (!isValidCode) return { success: false };

        const token = jwt.sign({ user: 'master' }, secretKey, { expiresIn: this.loginDuration.text });
        return {
            success: isValidCode,
            expiresIn: this.loginDuration.millis,
            token
        };
    };

    public static isLogged(token: string): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                if (!token) return resolve(false);

                jwt.verify(token, secretKey, (err) => {
                    if (err) return resolve(false);
                    return resolve(true);
                });
            }
            catch (err) {
                console.error(err);
                return resolve(false);
            }
        });
    };

};

export const secretKey = 'd2#D9E&5w9k&&%3Ec84NxC25hu@HT#v9';