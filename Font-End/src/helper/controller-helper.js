var misc = require("../lib/misc");

function parseGroupToPermission(groupList) {
    var permissionList = [];
    for (var g of groupList) {
        permissionList = permissionList.concat(g.permission);
    }
    
    var permissionHash = {}
    permissionList.forEach(p => permissionHash[p._id] = p);

    var permissionIdList = permissionList.map((p) => p._id);
    permissionIdList = misc.uniquePrimitiveArray(permissionIdList);

    return permissionIdList.map(pId => permissionHash[pId]);
}

module.exports = {
    parseGroupToPermission
};