var Project = require('../schema/project');
var validate = require("../lib/validate");
var controllerHelper = require("../helper/controller-helper");

async function create(data, done) {
    try {

        var checkDuplicate = await Project.findOne({
            project_code: data.projectCode
        });

        if (checkDuplicate) {
            throw new Error("Trùng mã dự án");
        }

        var project = await Project.create(data);

        return project;
    } catch (e) {
        throw e;
    }
}
async function findOne(query) {
    try {
        var project = await Project.findOne(query)
        return project
    } catch (error) {
        throw error
    }
}

async function find(query = {}) {
    try {
        const result = await Project.find(query)
        return result
    } catch (error) {
        throw error
    }
}

async function update(data) {
    try {
        const result = await Project.updateOne({ _id: data.id }, {
            $set: {
                status: data.status
            }
        })
        return result
    } catch (error) {
        throw error
    }
}

async function findById(projectCode){
    try {
        const result = await Project.findById(projectCode)
        return result
    } catch (error) {
        throw error
    }
}
module.exports = {
    create,
    findOne,
    find,
    update,
    findById
}