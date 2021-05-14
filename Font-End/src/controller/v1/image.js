var imageModel = require("../../model/images");
var dataTemplate = require("../../helper/data-template");
var responseTemplate = require("../../helper/response-template");

var responseCode = require("../../constant/response-code");
var commonConstant = require("../../constant/common");
const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const moment = require('moment');
async function create(req, res) {
    try {
        var pathTemp = path.join(__dirname, '../../../asset/temp');
        var pathDest = path.join(__dirname, '../../../public/img');
        var getUploadForm = () => new multiparty.Form({
            uploadDir: pathTemp
        });
        getUploadForm().parse(req,async(error,fields,files)=>{
            var fileSrcPath = files.myFile[0].path;
            var fileName = files.myFile[0].originalFilename;
            var fileDestPath = `${pathDest}/${fileName}`
            var fileSrc = `/img/${fileName}`
            const fileInfo = {
                name: fields.titleImage[0],
                sourceUrl: fileSrc,
                createAt: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                projectCode : fields.projectCode[0],
                projectName: fields.projectName[0]
            }
            fs.rename(fileSrcPath, fileDestPath,async function (err) { })
            await imageModel.createData(fileInfo)
        })
        return res.send(responseTemplate.success({
            message: "Thêm dự án thành công"
        }));
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function getList(req,res){
    try {
        const result = await imageModel.find()
        if (result) {
            return res.send(responseTemplate.success({
                data: result
            }));
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.SERVER_INTERNAL_ERROR
            }));
        }
    } catch (error) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function update(req, res){
    try {
        const data = req.body
        const result = await projectModel.update(data)
        const response = await informationPriceModel.updateStatus(data)
        return res.send(responseTemplate.success({
            message: "Cập nhật trạng thái dự án thành công."
        }));
    } catch (error) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

module.exports = {
    create,
    getList,
    update
}