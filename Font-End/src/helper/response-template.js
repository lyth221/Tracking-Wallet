var config = require("../../config");
var fs = require("fs");
var pathNext = require("path");
var misc = require("../lib/misc");
var responseCode = require("../constant/response-code");

module.exports = {
    // Response html file
    createResponse: (req, res, path) => {
        if (config.app.isDebug) {
            const http = require('http');
            http.get('http://localhost:' + config.webpack.port + path, response => {
                let data = '';
                response.on('data', chunk => data += chunk);
                response.on('end', () => res.send(data));
            });
        } else {
            fs.readFile(pathNext.join(__dirname, "..", "..", config.path.public) + path, 'utf8', function (err, data) {
                res.send(data);
            });
            // res.sendFile(app.publicPath + path);
        }
    },
    success(obj) {
        // message
        // data
        return {
            success: true,
            code: responseCode.SUCCESS,
            message: obj && obj.message,
            data: obj && misc.convertToArray(obj.data)
        }
    },
    error(obj) {
        // code
        // message
        // data
        return {
            success: false,
            code: obj && obj.code,
            message: obj && obj.message,
            data: obj && misc.convertToArray(obj.data)
        }
    },
    internalError(obj) {
        // message
        // data
        return {
            success: false,
            code: responseCode.SERVER_INTERNAL_ERROR,
            message: obj && obj.message || 'Server internal error',
            data: obj && misc.convertToArray(obj.data)
        }
    }
}