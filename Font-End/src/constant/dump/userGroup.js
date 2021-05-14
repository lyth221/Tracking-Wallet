var config = require("../../../config");
var user = require("./user");
var group = require("./group");

function mixUserWithGroup(user, groupList) {
    var ret = {};

    groupList.forEach(g => {
        ret[user + "_" + g] = {
            user: user,
            group: g
        }
    });

    return ret;
}

module.exports = {
    SUPER_ADMIN: {
        user: user.ADMIN.email,
        group: group.SUPER_ADMIN.name
    },
    SUPER_USER: {
        user: user.ADMIN.email,
        group: group.SUPER_USER.name
    },
    ...mixUserWithGroup(user.TEST_1.email, [
        group.EDITOR_KH_KT_MT.name,
        group.EDITOR_KT_XD.name,
    ]),
    ...mixUserWithGroup(user.MAYTINH.email, [
        group.EDITOR_KH_KT_MT.name,
    ]),
    ...mixUserWithGroup(user.KIENTRUC.email, [
        group.EDITOR_KT.name,
    ]),
    ...mixUserWithGroup(user.COKHI.email, [
        group.EDITOR_CK.name,
    ]),
    ...mixUserWithGroup(user.DAUKHI.email, [
        group.EDITOR_KT_DC_DK.name,
    ]),
    ...mixUserWithGroup(user.DIENTU.email, [
        group.EDITOR_D_DT.name,
    ]),
    ...mixUserWithGroup(user.GIAOTHONG.email, [
        group.EDITOR_KT_GT.name,
    ]),
    ...mixUserWithGroup(user.HOAHOC.email, [
        group.EDITOR_HH.name,
    ]),
    ...mixUserWithGroup(user.MOITRUONG.email, [
        group.EDITOR_MT_TN.name,
    ]),
    ...mixUserWithGroup(user.QL_CONGNGHIEP.email, [
        group.EDITOR_QL_CN.name,
    ]),
    ...mixUserWithGroup(user.KH_UNGDUNG.email, [
        group.EDITOR_KH_UD.name,
    ]),
    ...mixUserWithGroup(user.CN_VATLIEU.email, [
        group.EDITOR_CN_VL.name,
    ]),
    ...mixUserWithGroup(user.XAYDUNG.email, [
        group.EDITOR_KT_XD.name,
    ])
}
  