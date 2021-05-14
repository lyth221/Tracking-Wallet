var misc = require("../lib/misc");

var request = {
    user: {
        userLoginData(data) {
            var obj = {
                email: data.email,
                password: data.password
            };
    
            return obj;
        },
        userCreateData(data) {
            var obj = {
                email: data.email,
                password: data.password
            }

            return obj;
        },
        adminListData(data) {
            var obj = {
                page: data.page,
                offset: data.offset
            }

            return obj;
        },
        adminUpdateData(data) {
            var obj = {
                email: data.email,
                password: data.password,
                status: data.status
            }

            return obj;
        },
        userUpdateData(data) {
            var obj = {
                password: data.password
            }

            return obj;
        }
    },
    group: {
        
    },
    permission: {
        
    }
};

var response = {
    user: {
        jwtData(data) {
            var obj = {
                _id: data && data._id,
                email: data && data.email
            }

            return obj;
        },
        userData(data) {
            var obj = {
                _id: data && data._id,
                email: data && data.email,
                status: data && data.status
            }

            return obj;
        },
        adminUserData(data) {
            var obj = {
                _id: data && data._id,
                email: data && data.email,
                status: data && data.status
            }

            return obj;
        }
    },
    permission: {
        permissionData(permission) {
            var obj = {
                code: permission && permission.code,
                department: permission && misc.extractField(permission.department, ["name", "code", "_id"])
            }
    
            return obj;
        },
        checkTokenPermissionData(p) {
            var obj = {
                code: p && p.code
            }
    
            return obj;
        }
    },
    group: {
        groupData(group) {
            var obj = {
                _id: group && group._id,
                name: group && group.name,
                permission: group && group.permission.map(p => {
                    var pObj = misc.extractField(p, ["code", "department"]);
                    pObj.department = misc.extractField(pObj.department, ["name"]);
    
                    return pObj;
                })
            }
    
            return obj;
        }
    }
};

module.exports = {
    response,
    request
}