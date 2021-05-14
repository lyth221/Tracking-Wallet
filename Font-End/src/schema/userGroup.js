var mongoose = require('mongoose');

var userGroupSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, { 
    collection: 'userGroup' 
});

function populateSubSchema(next) {
    this.populate('group user');
    next();
}
  
userGroupSchema
    .pre('findOne', populateSubSchema)
    .pre('find', populateSubSchema);

var UserGroup = mongoose.model('userGroup', userGroupSchema);

module.exports = UserGroup;