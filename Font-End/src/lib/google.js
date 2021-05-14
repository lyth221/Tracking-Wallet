var request = require("./request");

async function verify(token, config) {
    try {
        const CLIENT_ID = config.client_id;

        if (!CLIENT_ID) {
            throw new Error("Missing client id");
        }

        var OAuth2Client = require('google-auth-library').OAuth2Client;
        var client = new OAuth2Client(CLIENT_ID);

        const url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token;
        let resp = await request.get(url);
        if (!(resp.aud && resp.aud === CLIENT_ID)) {
            throw new Error("Invalid google token");
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();

        return payload;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    verify
};