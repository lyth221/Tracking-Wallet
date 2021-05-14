var mongoose = require('mongoose');
var informationPriceModel = require("../../model/informationPrice");
var manageFileUploadModel = require("../../model/manageFileUpload");
var responseTemplate = require("../../helper/response-template");
var responseCode = require("../../constant/response-code");
var moment = require('moment');
const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const readXlsxFile = require('read-excel-file/node')

async function getFileInfo(req,res){
    try {
        const data = await manageFileUploadModel.find()
        if (data) {
            return res.send(responseTemplate.success({
                data: data
            }));
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.SERVER_INTERNAL_ERROR
            }));
        }
    } catch (error) {
        return res.send(responseTemplate.internalError({
            message: error.message
        }));
    }
}
module.exports = {
    getFileInfo
}