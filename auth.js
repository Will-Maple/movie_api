const jwtSecret = 'my_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jswtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not Right',
                    user: user
                });
            }
            req.login(user, { sesion: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToke(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}