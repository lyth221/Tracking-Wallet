const mongoose = require('mongoose')

const searchLogsSchema = mongoose.Schema({
    user_name: String,
    created_at: Date,
    timeSearch: String,
    data_return: Object
}, {
    collection: 'search_logs',
    strict: false
})

const searchLogsModel = mongoose.model('search_logs', searchLogsSchema)

module.exports = searchLogsModel