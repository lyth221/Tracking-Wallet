var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    status: {
        type: String,
        enum: ["active", "deactive"],
        default: "active"
    }
}, { 
    collection: 'user',
    strict: false
});

var User = mongoose.model('user', userSchema);

module.exports = User;
