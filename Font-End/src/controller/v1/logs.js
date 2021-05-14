var logsModel = require("../../model/logsSearchApartment");
var responseTemplate = require("../../helper/response-template");
var responseCode = require("../../constant/response-code");

async function searchLogs(req, res) {
    try {
        const result = await logsModel.findLogs(req.body)
        if (result) {
            return res.send(responseTemplate.success({
                data: result
            }));
        }
    } catch (error) {
        return res.send(responseTemplate.error({
            code: responseCode.SERVER_INTERNAL_ERROR
        }));
    }

}

module.exports = {
    searchLogs
}