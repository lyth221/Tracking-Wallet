var department = require("./department");

function getDepartment(exclude) {
    var departmentList = Object.keys(department).map(k => department[k].code);
    departmentList = departmentList.filter(d => {
        return exclude.indexOf(d.code) < 0; 
    });
    return departmentList;
}

function mixPermissionWithDepartment(permission, departmentList) {
    var ret = {};

    departmentList.forEach(d => {
        ret[permission + "_" + d] = {
            code: permission,
            department: d
        }
    });

    return ret;
}

module.exports = {
    USER_MANAGER: {
        code: "USER_MANAGER",
        department: undefined
    },
    ...mixPermissionWithDepartment("CREATE_EVENT", getDepartment([])),
    ...mixPermissionWithDepartment("APPROVE_EVENT", getDepartment([]))
}
  