var searchLogsSchema = require('../schema/logsSearchApartment');
var moment = require('moment');
async function createData(data, userData) {
    try {
        const dataLogs = {
            user_name: userData.email,
            timeSearch: userData.timeSearch,
            created_at: userData.created_at,
            data_return: data
        }
        await searchLogsSchema.create(dataLogs)

    } catch (error) {

    }
}

async function find() {
    try {
        const listLogs = await searchLogsSchema.find()
        return listLogs
    } catch (error) {
        throw error
    }
}

async function findLogs(data) {
    console.log("dataa", data)
    try {

        let query = {}
        if (data.departmentCode != "") {
            query["data_return.ma_bds"] = data.departmentCode
        }

        if (data.projectCode != null) {
            query["data_return.project_code"] = data.projectCode
        }

        if (data.user != null) {
            query['user_name'] = data.user
        }
        if (data.timeSearch != null) {
            query['timeSearch'] = moment(data.timeSearch).format('YYYY-MM-DD')
        }
        const dataReturn = await searchLogsSchema.find(query).sort({ created_at: 1 })
        console.log("return data", dataReturn)
        return dataReturn;

    } catch (error) {
        throw error;
    }
}

async function count() {
    try {
        const countData = await searchLogsSchema.count()
        return countData
    } catch (error) {
        throw error
    }
}
module.exports = {
    createData,
    find,
    count,
    findLogs
};