var imageSchema = require('../schema/images.js');

async function createData(data) {
    try {
        let result = null
        const checkFile = await imageSchema.findOne({ "projectCode": `${data.projectCode}` })
        
        if (checkFile == null) {
            result =  await imageSchema.create(data)
        } else {
            result = await imageSchema.updateOne({"projectCode"
            : `${data.projectCode}` }, {
                $set: {
                    name: data.name,
                    sourceUrl: data.sourceUrl,
                }
            })
        }
        return result
    } catch (error) {
        throw error
    }
}

async function find() {
    try {
        const listImage = await imageSchema.find()
        return listImage
    } catch (error) {
        throw error
    }
}
module.exports = {
    createData,
    find
};  