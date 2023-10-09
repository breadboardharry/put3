import AuthModule from '../modules/auth/auth.js';

const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    // Check if the token is valid
    AuthModule.isLogged(token).then((logged) => {
        if (!logged) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        next();
    });
};

export default AuthMiddleware;
