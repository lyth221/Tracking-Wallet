var responseTemplate = require("../helper/response-template");

function defaultResponse(req, res) {
    return responseTemplate.createResponse(req, res, '/index.template');
}

module.exports = {
    defaultResponse
}