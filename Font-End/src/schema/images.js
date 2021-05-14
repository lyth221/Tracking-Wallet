const mongoose = require('mongoose')

const imagesSchema = mongoose.Schema({
    name:String,
    source_url: String,
    created_at: Date,
    project_name: String,
    project_code:String
},{
    collection:'images',
    strict: false
})

const imagesModel = mongoose.model('images', imagesSchema)

module.exports = imagesModel