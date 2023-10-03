import jwt from 'jsonwebtoken';

const secretKey = 'd2#D9E&5w9k&&%3Ec84NxC25hu@HT#v9';

const loginDuration = {
    millis: 3600000,
    text: '1h'
};

/**
 * Login a user
 * @param {string} code The code to login with
 * @returns {object} An object containing a success, a token, and a duration property
 * @example login('valid-code') => { success: true, token: '...', expiresIn: 3600000 }
 * @example login('wrong-code') => { success: false, token: '', expiresIn: 0 }
 */
const login = (code) => {
    let token = '';
    const validCode = code == process.env.MASTER_CODE;

    // If the code is valid, generate a token
    if (validCode) token = jwt.sign({ user: 'master' }, secretKey, { expiresIn: loginDuration.text });

    return {
        success: validCode,
        expiresIn: validCode ? loginDuration.millis : 0,
        token
    };
};

/**
 * Check if a user is logged in via token
 * @param {string} token The user token to check
 * @returns {boolean} True if logged in, false otherwise
 */
const isLogged = (token) => {
    return new Promise((resolve, reject) => {
        try {
            if (!token) return resolve(false);

            jwt.verify(token, secretKey, (err, decoded) => {
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

const AuthModule = {
    login,
    isLogged,
    secretKey
};

export default AuthModule;
