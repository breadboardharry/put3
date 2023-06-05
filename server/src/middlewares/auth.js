import jwt from 'jsonwebtoken';

const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    console.log("token");
    console.log(token);
    if (!token) {
        // No token found in the cookie
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token and check the expiration time
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        // Token verification failed
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Token verification succeeded
        // You can access the decoded payload with decoded.user

        next();
    });
};

export default AuthMiddleware;
