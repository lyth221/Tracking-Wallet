var User = require('../schema/user');
var validate = require("../lib/validate");
var controllerHelper = require("../helper/controller-helper");



async function create(data, done) {
    try {
        validate.validateStr([{
            value: data.email,
            type: "email",
            nullable: false
        }]);

        validate.validateStr([{
            value: data.password,
            nullable: true
        }]);

        var checkDuplicate = await User.findOne({
            email: data.email
        });

        if (checkDuplicate) {
            if (checkDuplicate.status == "active") {
                throw new Error("Email này đã được sử dụng");
            }
            if (checkDuplicate.status == "deactive") {
                throw new Error("Email này đã được sử dụng. Tài khoản này đang bị vô hiệu.");
            }
        }

        var user = await User.create(data);

        return Object.assign(user);
    } catch (e) {
        throw e;
    }
}

async function find(query) {
    try {
        query = typeof (query) == "object" ? query : {};
        var userList = await User.find(query);

        return Object.assign(userList);

    } catch (e) {
        throw e;
    }
}

async function findOne(query) {
    try {
        query = typeof (query) == "object" ? query : {};
        var user = await User.findOne(query);


        if (user) {
            return Object.assign(user);
        } else {
            return user
        }
    } catch (e) {
        throw e;
    }
}

async function findById(userId) {
    try {
        const userData = await User.findById(userId)
        return userData;
    } catch (error) {
        throw error;
    }
}

async function findOneAndUpdate(userData, data) {
    try {
        const result = await User.findOneAndUpdate({ "_id": `${userData}` }, {
            $set: {
                password: data
            }
        })
        return result;
    } catch (error) {
        throw error;
    }
}

async function save(user) {
    try {
        validate.validateStr([{
            value: user.email,
            type: "email",
            nullable: false
        }]);

        validate.validateEnum([{
            value: user.status,
            e: ["active", "deactive"],
            nullable: false
        }]);

        var checkDuplicate = await User.findOne({
            email: user.email,
            _id: {
                $ne: user._id
            }
        });

        if (checkDuplicate) {
            if (checkDuplicate.status == "active") {
                throw new Error("Email này đã được sử dụng");
            }
            if (checkDuplicate.status == "deactive") {
                throw new Error("Email này đã được sử dụng. Tài khoản này đang bị vô hiệu.");
            }
        }

        await user.save();

        return user;
    } catch (e) {
        throw e;
    }
}

async function updatePermission(data, userId) {
    try {
        const result = await User.updateOne({ _id: userId }, {
            $set: {
                "permission_project": data
            }
        })
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    User,
    create,
    findOne,
    find,
    save,
    updatePermission,
    findById,
    findOneAndUpdate
};
