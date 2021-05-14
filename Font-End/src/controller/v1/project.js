var projectModel = require("../../model/project");
var userModel = require("../../model/user");
var dataTemplate = require("../../helper/data-template");
var responseTemplate = require("../../helper/response-template");
var informationPriceModel = require("../../model/informationPrice");
var jwt = require("../../lib/jwt");
var config = require("../../../config.json");
var responseCode = require("../../constant/response-code");
var commonConstant = require("../../constant/common");
async function create(req, res) {
    try {
        var projectData = req.body;
        result = await projectModel.create({
            project_code: projectData.projectCode,
            project_name: projectData.projectName,
            category_project_code: projectData.categoryProjectCode,
            category_project_name: projectData.categoryProjectName,
            status: 'active'
        });

        return res.send(responseTemplate.success({
            message: "Thêm dự án thành công"
        }));
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function getList(req, res) {
    try {
        const result = await projectModel.find()
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
        console.error(error);
        return res.send(responseTemplate.internalError());
    }
}

async function getListByUser(req, res) {
    try {
        let token = req.headers.authorization || req.body.jwt || req.query.jwt;
        let userData = await jwt.verify(token, config.app.jwt);
        const result = await userModel.findById(userData._id)
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
        console.error(error);
        return res.send(responseTemplate.internalError());
    }
}

async function getProject(req, res) {
    try {
        const projectId = req.params.id
        const result = await projectModel.findById(projectId)
        return res.send(responseTemplate.success({
            data: result
        }));
    } catch (error) {
        console.error(error);
        return res.send(responseTemplate.internalError());
    }
}

async function update(req, res) {
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
    update,
    getListByUser,
    getProject
}