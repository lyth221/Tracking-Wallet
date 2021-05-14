var express = require('express');
var router = express.Router();
var helper = require("../helper/route-helper");

var indexController = require('../controller/index');


var routeList = [
    '/', 
    '/search'
];
    
routeList.forEach(route => router.get(route, indexController.defaultResponse));

helper.redirectToWebpackServer(router);

module.exports = router;