var permission = require("./permission");
var department = require("./department");
var user = require("./user");

function getPermision(exclude) {
    var permissionList = Object.keys(permission).map(k => {
        return {
            code: permission[k].code,
            department: permission[k].department
        }
    });
    permissionList = permissionList.filter(p => {
        exclude.forEach(e => {
            if (e.code == p.code && e.department == p.department) {
                return false;
            }
        });
        return true;
    });

    return permissionList;
}

module.exports = {
    SUPER_ADMIN: {
        name: "SUPER_ADMIN",
        permission: getPermision([{
            code: permission.USER_MANAGER.code,
            department: undefined
        }])
    },
    SUPER_USER: {
        name: "SUPER_USER",
        permission: [{
            code: permission.USER_MANAGER.code,
            department: undefined
        }]
    },
    EDITOR_KH_KT_MT: {
        name: "EDITOR_KH_KT_MT",
        permission: [{
            code: permission.CREATE_EVENT_KH_KT_MT.code,
            department: department.KH_KT_MT.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_KT: {
        name: "EDITOR_KT",
        permission: [{
            code: permission.CREATE_EVENT_KT.code,
            department: department.KT.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_CK: {
        name: "EDITOR_CK",
        permission: [{
            code: permission.CREATE_EVENT_CK.code,
            department: department.CK.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_KT_DC_DK: {
        name: "EDITOR_KT_DC_DK",
        permission: [{
            code: permission.CREATE_EVENT_KT_DC_DK.code,
            department: department.KT_DC_DK.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_D_DT: {
        name: "EDITOR_D_DT",
        permission: [{
            code: permission.CREATE_EVENT_D_DT.code,
            department: department.D_DT.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_KT_GT: {
        name: "EDITOR_KT_GT",
        permission: [{
            code: permission.CREATE_EVENT_KT_GT.code,
            department: department.KT_GT.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_HH: {
        name: "EDITOR_HH",
        permission: [{
            code: permission.CREATE_EVENT_HH.code,
            department: department.HH.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_MT_TN: {
        name: "EDITOR_MT_TN",
        permission: [{
            code: permission.CREATE_EVENT_MT_TN.code,
            department: department.MT_TN.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_QL_CN: {
        name: "EDITOR_QL_CN",
        permission: [{
            code: permission.CREATE_EVENT_QL_CN.code,
            department: department.QL_CN.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_KH_UD: {
        name: "EDITOR_KH_UD",
        permission: [{
            code: permission.CREATE_EVENT_KH_UD.code,
            department: department.KH_UD.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_CN_VL: {
        name: "EDITOR_CN_VL",
        permission: [{
            code: permission.CREATE_EVENT_CN_VL.code,
            department: department.CN_VL.code
        }],
        creator: user.ADMIN.email
    },
    EDITOR_KT_XD: {
        name: "EDITOR_KT_XD",
        permission: [{
            code: permission.CREATE_EVENT_KT_XD.code,
            department: department.KT_XD.code
        }],
        creator: user.ADMIN.email
    },

}