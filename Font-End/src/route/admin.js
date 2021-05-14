var express = require('express');
var router = express.Router();
var helper = require("../helper/route-helper");


var adminController = require('../controller/admin');

var routeList = [
    '/',
    '/menu',
    '/user',
    '/upload/file',
    '/upload/image',
    '/project',
    '/edit/file',
    '/download/file',
    '/history'
];

routeList.forEach(route => router.get(route, adminController.defaultResponse));

helper.redirectToWebpackServer(router);

module.exports = router;
