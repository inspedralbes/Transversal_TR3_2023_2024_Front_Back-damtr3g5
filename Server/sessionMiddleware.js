const session = require('express-session');
require('dotenv').config();
const sessionMiddleware = session({
    secret: 'mySecretKey',
    resave: true,
    name: "juego",
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        domain: process.env.DOMAIN,
        path: "/",
        maxAge: 3600000,
        sameSite: 'lax'
    }
});
module.exports = sessionMiddleware;
