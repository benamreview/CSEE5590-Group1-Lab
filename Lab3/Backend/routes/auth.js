const jwt = require('express-jwt/lib');
const secret = require('../config').secret;

function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

const auth = {
    required: jwt({
        secret: secret,
        getToken: getToken
    }),
    optional: jwt({
        secret: secret,
        credentialsRequired: false,
        getToken: getToken
    })
};

module.exports = auth;
