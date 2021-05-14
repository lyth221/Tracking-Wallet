const mongoose = require('mongoose')

const manageFileUploadSchema = mongoose.Schema({
    
},{
    collection:'file_upload',
    strict: false
})

const manageFileUploadModel = mongoose.model('file_upload', manageFileUploadSchema)

module.exports = manageFileUploadModel