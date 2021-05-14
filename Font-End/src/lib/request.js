var request = require("request");

function get(url) {
    return new Promise(function (resolve, reject) {
        request.get(url, function (error, res, body) {
            if (!error) {
                var object = JSON.parse(body);
                resolve(object);
            } else {
                reject(error);
            }
        });
    });
}

module.exports = {
    get
}