var config = require("../../config");
var path = require("path");

module.exports = {
    // Redirect to webpack server
    redirectToWebpackServer: (router) => {
        if (config.app.isDebug) {
            router.get('/*.js', (req, res) => {
                if (req.originalUrl.endsWith('.min.js')) {
                    res.next();
                } else {
                    res.redirect('http://localhost:' + config.webpack.port + '/js/' + path.basename(req.originalUrl));
                }
            });
        }
    }
}