var express = require('express');
var router = express.Router();
var auth = require("../../middleware/authorization");

var userController = require('../../controller/v1/user');

var fileController = require('../../controller/v1/importExcel');
var fileUploadController = require('../../controller/v1/manageFileUpload');
var projectController = require('../../controller/v1/project');
var imageController = require('../../controller/v1/image');
var adminController = require('../../controller/admin');
var logsController = require('../../controller/v1/logs');

var pConst = require("../../constant/permission")

router.post("/user/login", userController.login);
router.post("/user/checkToken", auth.isAuthorized, userController.checkToken);

router.get("/user/login/social", userController.getGoogleClientId);
router.post("/user/login/social/auth", userController.checkGoogleCode);

// only for admin


router.get("/user", auth.isAuthorized, auth.hasPermission(pConst.USER_MANAGER), userController.list);
router.get("/user/:id", auth.isAuthorized, auth.hasPermission(pConst.USER_MANAGER), userController.retrieve);
router.post("/user", userController.create);
router.put("/user", auth.isAuthorized, userController.update);
router.put("/user/:id", auth.isAuthorized, auth.hasPermission(pConst.USER_MANAGER), userController.adminUpdate);
router.put("/permission/user/:id", auth.isAuthorized, userController.updatePermission)
router.post("/project/create", projectController.create);
router.put("/project/update/:id", projectController.update);
router.post("/image/upload", imageController.create);
router.get("/image/getList", imageController.getList);
router.get("/project/get_list", projectController.getList);
router.get("/project/get_list_user", projectController.getListByUser);
router.get("/project/get/:id", projectController.getProject)
router.post("/file/upload", fileController.importFile);
router.get("/file/get_data", auth.isAuthorized, fileController.getData);
router.get("/manage/file/get", fileUploadController.getFileInfo);
router.get("/data/file/get/:projectCode", fileController.geDepartment);
router.get("/log/count", adminController.getCountSearch);
router.post("/logs/search", logsController.searchLogs)

// only for user

router.get("/public/user", auth.isAuthorized, userController.retrievePublic);

module.exports = router;
