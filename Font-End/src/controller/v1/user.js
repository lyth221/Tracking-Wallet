var validate = require("../../lib/validate");
var misc = require("../../lib/misc");
var jwt = require("../../lib/jwt");
var google = require("../../lib/google");

var dataTemplate = require("../../helper/data-template");
var responseTemplate = require("../../helper/response-template");

var responseCode = require("../../constant/response-code");
var commonConstant = require("../../constant/common");
var userModel = require("../../model/user");
var projectModel = require("../../model/project");
var config = require("../../../config");
var socket = require("../../socket/socket");
var ObjectId = require('mongoose').Types.ObjectId;


async function checkToken(req, res) {
    try {
        try {
            if (!req.user) {
                throw new Error("Token không hợp lệ.");
            }

            if (req.user.status == "active") {
                return res.send(responseTemplate.success({
                    message: "token verified"
                }));
            }

            if (req.user.status == "deactive") {
                return res.send(responseTemplate.error({
                    code: responseCode.DATA_NOT_AVAILABLE,
                    message: "Tài khoản này đang bị vô hiệu."
                }));
            }
        } catch (e) {
            return res.send(responseTemplate.error({
                code: responseCode.TOKEN_NOT_VALID,
                message: e.message
            }));
        }
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function login(req, res) {
    try {
        var userData = dataTemplate.request.user.userLoginData(req.body);
        try {
            validate.validateStr([{
                value: userData.email,
                type: "email",
                message: "Email không hợp lệ",
                nullable: false
            }, {
                value: userData.password,
                message: "Mật khẩu không hợp lệ",
                nullable: false
            }]);
        } catch (e) {
            return res.send(responseTemplate.error({
                code: responseCode.INPUT_DATA_WRONG_FORMAT,
                message: e.message
            }));
        }

        userData.password = misc.sha256(userData.password);

        var user = await userModel.findOne({
            email: userData.email,
            password: userData.password
        });

        if (user) {
            if (user.status == "active") {
                user = dataTemplate.response.user.jwtData(user);
                var { token } = await jwt.createToken(user, config.app.jwt);

                return res.send(responseTemplate.success({
                    message: "Đăng nhập thành công.",
                    data: token
                }));
            }

            if (user.status == "deactive") {
                return res.send(responseTemplate.error({
                    code: responseCode.DATA_NOT_AVAILABLE,
                    message: "Tài khoản này đang bị vô hiệu."
                }));
            }
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_NOT_FOUND,
                message: "Đăng nhập thất bại"
            }));
        }
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

function getGoogleClientId(req, res) {
    try {
        return res.send(responseTemplate.success({
            message: "client id",
            data: config.app.google.client_id
        }));
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function checkGoogleCode(req, res) {
    try {
        var googleToken = req.body.code;

        try {
            validate.validateStr([{
                value: googleToken,
                message: "Token không hợp lệ",
                nullable: false
            }])
        } catch (e) {
            return res.send(responseTemplate.error({
                code: responseCode.INPUT_DATA_WRONG_FORMAT,
                message: e.message
            }));
        }

        try {
            var userData = await google.verify(googleToken, config.app.google);
        } catch (e) {
            return res.send(responseTemplate.error({
                code: responseCode.TOKEN_NOT_VALID,
                message: "Đăng nhập thất bại: " + e.message
            }));
        }

        if (validate.validateBkuEmail(userData.email)) {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_CONTRAINT_VIOLATED,
                message: "Đăng nhập thất bại: Email của bạn phải do trường đại học Bách Khoa thành phố HCM quản lí. "
            }));
        }

        var user = await userModel.findOne({
            email: userData.email
        });

        if (user && user.status == "deactive") {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_NOT_AVAILABLE,
                message: "Tài khoản này đang bị vô hiệu."
            }));
        }

        if (!user) {
            user = await userModel.create({
                email: userData.email
            });
        }

        user = dataTemplate.response.user.jwtData(user);
        var jwtToken = await jwt.createToken(user, config.app.jwt);

        return res.send(responseTemplate.success({
            message: "Đăng nhập thành công",
            data: jwtToken.token
        }));
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function list(req, res) {
    try {
        var query = dataTemplate.request.user.adminListData(req.query);
        var page = query.page || commonConstant.DEFAULT_PAGE;
        var offset = query.offset || commonConstant.DEFAULT_OFFSET;

        var user = req.user;

        var userList = await userModel.find({
            _id: {
                $ne: user._id
            }
        });
        return res.send(responseTemplate.success({
            message: "user list",
            data: userList
        }))
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function retrieve(req, res) {
    try {
        var userId = req.params.id;
        var user = req.user;

        try {
            validate.validateStr([{
                value: userId,
                message: "Id không hợp lệ",
                nullable: false
            }]);

            validate.validateMongoId(userId);
        } catch (e) {
            return res.send(responseTemplate.error({
                code: responseCode.INPUT_DATA_WRONG_FORMAT,
                message: e.message
            }));
        }

        if (userId == user._id) {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_CONTRAINT_VIOLATED,
                message: "Bạn không thể xem thông tin của mình ở đây."
            }));
        }

        var userData = await userModel.findOne({
            _id: userId
        });

        if (userData) {
            return res.send(responseTemplate.success({
                message: `user ${userId} data`,
                data: {
                    ...dataTemplate.response.user.userData(userData)
                }
            }));
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_NOT_FOUND,
                message: "Không tìm thấy thông tin người dùng."
            }));
        }
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function create(req, res) {
    try {
        var userData = req.body;
        try {
            validate.validateStr([{
                value: userData.email,
                type: "email",
                message: "Email không hợp lệ",
                nullable: false
            }, {
                value: userData.password,
                message: "Mật khẩu không hợp lệ",
                nullable: true
            }]);
        } catch (e) {
            return res.send(responseTemplate.error({
                code: responseCode.INPUT_DATA_WRONG_FORMAT,
                message: e.message
            }));
        }

        var user = await userModel.findOne({
            email: userData.email
        });

        if (user) {
            if (user.status == "active") {
                return res.send(responseTemplate.error({
                    code: responseCode.DATA_NOT_AVAILABLE,
                    message: "Tài khoản này đã tồn tại."
                }));
            }

            if (user.status == "deactive") {
                return res.send(responseTemplate.error({
                    code: responseCode.DATA_NOT_AVAILABLE,
                    message: "Tài khoản này đã tồn tại và đang bị vô hiệu."
                }));
            }
        } else {
            const passUser = misc.sha256(userData.password);
            let listProject = []
            userData.lstProjectSet.forEach(async element => {
                let result = await projectModel.findById(element)
                let template = {
                    projectCode: result.project_code,
                    projectName: result.project_name,
                    projectId: result._id,
                    status: result.status
                }
                listProject.push(template)
            });
            user = await userModel.create({
                email: userData.email,
                password: passUser,
                permission_project: listProject
            });

            return res.send(responseTemplate.success({
                message: "Tạo user thành công",
                data: {
                    ...dataTemplate.response.user.userData(user)

                }
            }));
        }
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function adminUpdate(req, res) {
    try {
        var userId = req.params.id;
        var userData = dataTemplate.request.user.adminUpdateData(req.body);
        var user = req.user;

        if (req.body.newPassword) {
            const result = await updatePassword(req.body.newPassword, userId)
            return result
        }

        try {
            validate.validateStr([{
                value: userId,
                message: "Id không hợp lệ",
                nullable: false
            }]);

            validate.validateMongoId(userId);
        } catch (e) {
            return res.send(responseTemplate.error({
                code: responseCode.INPUT_DATA_WRONG_FORMAT,
                message: e.message
            }));
        }

        if (userId == user._id) {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_CONTRAINT_VIOLATED,
                message: "Bạn không thể chỉnh sửa thông tin của mình ở đây."
            }));
        }

        var user = await userModel.findOne({
            _id: userId
        });

        if (user) {
            userData = misc.filterObj(userData, (o) => {
                if (o === undefined) {
                    return false;
                }
                else {
                    return true;
                }
            });
            user = Object.assign(user, userData);

            try {
                validate.validateStr([{
                    value: user.email,
                    type: "email",
                    message: "Email không hợp lệ",
                    nullable: false
                }]);

                validate.validateEnum([{
                    value: user.status,
                    e: ["active", "deactive"],
                    message: "Trạng thái không hợp lệ.",
                    nullable: false
                }]);
            } catch (e) {
                return res.send(responseTemplate.error({
                    code: responseCode.INPUT_DATA_WRONG_FORMAT,
                    message: e.message
                }));
            }

            var check = await userModel.findOne({
                email: user.email,
                _id: {
                    $ne: user._id
                }
            });

            if (check) {
                return res.send(responseTemplate.error({
                    code: responseCode.DATA_NOT_AVAILABLE,
                    message: "Tài khoản này đã được sử dụng."
                }));
            }

            var updatedUser = await userModel.save(user);

            return res.send(responseTemplate.success({
                message: "Cập nhật user thành công",
                data: {
                    ...dataTemplate.response.user.userData(updatedUser),

                }
            }));
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_NOT_FOUND,
                message: "Không tìm thấy thông tin người dùng."
            }));
        }
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function updatePermission(req, res) {
    try {
        let listPermission = []
        const userId = req.params.id;
        for (let projectCode in req.body) {
            if (req.body[projectCode]) {
                let result = await projectModel.findOne({ "project_code": `${projectCode}` })
                let permission = {
                    projectCode: result.project_code,
                    projectName: result.project_name,
                    status: result.status,
                    projectId: result._id
                }
                listPermission.push(permission)
            }
        }
        const result = await userModel.updatePermission(listPermission, userId)
        if (result) {
            return res.send(responseTemplate.success({
                message: "Cập nhật user thành công",
            }));
        } else {
            return res.send(responseTemplate.error({
                message: "Không tìm thấy thông tin người dùng."
            }));
        }
    } catch (error) {
        console.error(error);
        return res.send(responseTemplate.internalError());
    }
}
async function update(req, res) {
    try {
        var userData = dataTemplate.request.user.userUpdateData(req.body);
        var user = req.user;
        var userId = user._id;

        var user = await userModel.findOne({
            _id: userId
        });

        if (user) {
            if (user.status == "deactive") {
                return res.send(responseTemplate.error({
                    code: responseCode.DATA_NOT_AVAILABLE,
                    message: "Tài khoản này đang bị vô hiệu."
                }));
            }

            userData = misc.filterObj(userData, (o) => {
                if (o === undefined) {
                    return false;
                }
                else {
                    return true;
                }
            });

            if (userData.password && !user.password) {
                return res.send(responseTemplate.error({
                    code: responseCode.DATA_CONTRAINT_VIOLATED,
                    message: "Bạn không có quyền cập nhật mật khẩu cho tài khoản này"
                }));
            }

            user = Object.assign(user, userData);

            try {
                validate.validateStr([{
                    value: user.password,
                    message: "Mật khẩu không hợp lệ",
                    nullable: false
                }]);
            } catch (e) {
                return res.send(responseTemplate.error({
                    code: responseCode.INPUT_DATA_WRONG_FORMAT,
                    message: e.message
                }));
            }

            user.password = misc.sha256(user.password);

            var updatedUser = await userModel.save(user);

            return res.send(responseTemplate.success({
                message: "Cập nhật user thành công",
                data: {
                    ...dataTemplate.response.user.userData(updatedUser)
                }
            }));
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_NOT_FOUND,
                message: "Không tìm thấy thông tin người dùng."
            }));
        }
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function retrievePublic(req, res) {
    try {
        var userId = req.user._id;
        var user = req.user;

        try {
            userId = userId.toString();
            validate.validateMongoId(userId);
        } catch (e) {
            return res.send(responseTemplate.error({
                code: responseCode.INPUT_DATA_WRONG_FORMAT,
                message: e.message
            }));
        }

        var userData = await userModel.findOne({
            _id: userId
        });

        if (userData) {
            return res.send(responseTemplate.success({
                message: `user ${userId} data`,
                data: {
                    ...dataTemplate.response.user.userData(userData),
                    permission: userData.permission.map(p => dataTemplate.response.permission.permissionData(p)),
                    group: userData.group.map(g => dataTemplate.response.group.groupData(g))
                }
            }));
        } else {
            return res.send(responseTemplate.error({
                code: responseCode.DATA_NOT_FOUND,
                message: "Không tìm thấy thông tin người dùng."
            }));
        }
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.internalError());
    }
}

async function updatePassword(newPassword, userData) {
    console.log("chayj tieeps", newPassword, userData);
    const newPassUser = misc.sha256(newPassword);
    const result = await userModel.findOneAndUpdate(userData, newPassUser);

    if (result) {
        return result;
    } else {
        return null;
    }

}

module.exports = {
    login,
    checkToken,
    getGoogleClientId,
    checkGoogleCode,
    list,
    retrieve,
    create,
    update,
    adminUpdate,
    retrievePublic,
    updatePermission,
    updatePassword
}