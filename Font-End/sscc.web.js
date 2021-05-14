const package = require('./package');
const config = require('./config');
const express = require('express');
const io = require('socket.io')();
const app = express();
const server = require('http').createServer(app);
app.fs = require('fs');
app.path = require('path');

// Variables ==================================================================
app.version = package.version;

app.title = config.app.title;
app.server = config.server;
app.webpack = config.webpack;
app.description = config.app.description;
app.keywords = config.keywords ? JSON.stringify(config.keywords) : '';
app.isDebug = config.app.isDebug;
app.autoLogin = config.app.autoLogin;
app.mongodb = config.database.mongodb_uri + config.database.name;
app.email = config.email
app.defaultAccount = config.default_account;

app.srcPath = app.path.join(__dirname, config.path.src);
app.viewPath = app.path.join(__dirname, config.path.view);
app.modelPath = app.path.join(__dirname, config.path.model);
app.controllerPath = app.path.join(__dirname, config.path.controller);
app.publicPath = app.path.join(__dirname, config.path.public);
app.logPath = app.path.join(__dirname, config.path.log);
app.uploadPath = app.path.join(__dirname, config.path.upload);
app.faviconPath = app.path.join(__dirname, config.path.favicon);

// Configure ==================================================================
require('./src/config/common')(app);
require('./src/config/view')(app, express);
require('./src/config/packages')(app, server);
require("./src/socket/socket.js")(app);
require('./src/config/io')(app, server);

// Load model, controller, route ==============================================
var db = require("./src/schema/index");
require("./src/schema/user");



var indexRoute = require('./src/route/index');
var adminRoute = require('./src/route/admin');
var apiRoute = require('./src/route/v1/index');

app.db = db.connect();
app.use("/api/v1", apiRoute);
app.use("/", indexRoute);
app.use("/admin", adminRoute);

// Init =======================================================================

// var dump = require("./src/job/dump/dump");
// dump.run();

app.createFolder([app.publicPath, app.uploadPath]);
if (!app.isDebug) app.createFolder(app.logPath);
require('./src/config/error')(app);

// Launch website =============================================================
app.keywords = (app.keywords && app.keywords.length > 2 ? app.keywords.substring(2, app.keywords.length - 2) : '').replaceAll('","', ', ');
server.listen(app.server.port, () => console.log(' - ' + app.title + ' on http://localhost:%d.', app.server.port));
