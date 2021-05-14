var responseTemplate = require("../helper/response-template");
var searchLogsSchema = require("../model/logsSearchApartment");

function defaultResponse(req, res) {
    return responseTemplate.createResponse(req, res, '/admin.template');
}
async function getCountSearch(req, res) {
    try {
        const result = await searchLogsSchema.count()
        return res.send(responseTemplate.success({
            data: result
        }));
    } catch (error) {
        return res.send(responseTemplate.success({
            data: 0
        }));
    }


}
module.exports = {
    defaultResponse,
    getCountSearch
}