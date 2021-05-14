var manageFileUploadSchema = require('../schema/manageFileUpload.js');

async function createData(data) {
    try {
        const result = null
        const checkFile = manageFileUploadSchema.findOne({ "name": `${data.name}` })
        if (checkFile) {
            result =  await manageFileUploadSchema.create(data)
        } else {
            result = await manageFileUploadSchema.updateOne({ "name"
            : `${data.name}` }, {
                $set: {
                    name: data.name,
                    source: data.source,
                    timeUpload: data.timeUpload
                }
            })
        }
        return result
    } catch (error) {

    }
}
// async function finByCode(query) {
//     try {
//         const dataFile = manageFileUploadSchema.findOne({})
//     } catch (error) {

//     }
// }
async function find() {
    try {
        const dataFile = await manageFileUploadSchema.find()

        return dataFile
    } catch (error) {

    }
}
module.exports = {
    createData,
    // finByCode,
    find
};  