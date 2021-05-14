var jwt = require('jsonwebtoken');

async function verify(token, config) {
    try {

        if (!token) {
            throw new Error("Missing token")
        }

        if (!token.startsWith("Bearer ")) {
            throw new Error("Invalid token");
        }

        token = token.substring(7, token.length);

        let verifyResult = await jwt.verify(token, config.jwt_secret);
        return verifyResult;
    } catch (e) {
        throw e;
    }
}

async function createToken(obj, config) {
    try {

        let timeExpire = 300

        if (obj.email === 'sale_admin') {
            timeExpire = 43200
        }

        let NOW = Date.now() / 1000;
        let payload = {
            exp: NOW + timeExpire,
            iat: NOW,
            iss: config.iss,
            ...obj
        };

        let token = jwt.sign(payload, config.jwt_secret);

        return {
            token,
            payload
        };
    } catch (e) {
        throw e;
    }
}

module.exports = {
    verify,
    createToken
};