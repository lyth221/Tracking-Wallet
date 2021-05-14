var jwt = require("../lib/jwt");
var userModel = require("../model/user");
var responseTemplate = require("../helper/response-template");
var responseCode = require("../constant/response-code");
var config = require("../../config.json");
var controllerHelper = require("../helper/controller-helper");

function hasPermission(code) {
    return async function(req, res, next) {
        try {
            var user = req.user;
            var group = req.user.group;
            // console.log("group", group);
            if (!user) {
                throw new Error("Bạn không đủ quyền để truy cập dữ liệu này.")
            }

            if (!code) {
                if (group.length) {
                    return next();
                } else {
                    throw new Error("Bạn không đủ quyền để truy cập dữ liệu này.")
                }
            }

            return next();
        } catch (e) {
            console.error(e);
            return res.send(responseTemplate.error({
                code: responseCode.ACCESS_DENIED,
                message: e.message,
            }));
        }
    };
}

function isUser(req, res, next) {
    try {
        var group = req.user.group;

        if (group.length != 0) {
            throw new Error("Bạn không đủ quyền để truy cập dữ liệu này.")
        }

        return next();
    } catch (e) {
        console.error(e);
        return res.send(responseTemplate.error({
            code: responseCode.ACCESS_DENIED,
            message: e.message,
        }));
    }
}

async function isAuthorized(req, res, next) {
    try {
        let token = req.headers.authorization || req.body.jwt || req.query.jwt;
        let result = await jwt.verify(token, config.app.jwt);
        var user = await userModel.find({
            _id: result._id
        });

        if (user.length != 1) {
            throw new Error("Token của bạn không hợp lệ.");
        }

        req.user = {};
        req.user = user[0];
        return next();
    } catch (e) {
        return res.send(responseTemplate.error({
            message: "Hết phiên làm việc",
        }));
    }
}

module.exports = {
    isAuthorized,
    hasPermission,
    isUser
}