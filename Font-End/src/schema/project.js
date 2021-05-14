const mongoose = require('mongoose')

const manageProjectSchema = mongoose.Schema({
    project_name: String,
    project_code: String,
    status: String
},{
    collection:'projects',
    strict: false
})

const manageProjectModel = mongoose.model('projects', manageProjectSchema)

module.exports = manageProjectModel