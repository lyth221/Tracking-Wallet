var mongoose = require('mongoose');
var config = require("../../config.json");
var mongoDB = config.database.uri + config.database.name;

mongoose.Promise = global.Promise;
function connect() {
    mongoose.connect(mongoDB);
    // mongoose.connect(mongoDB, { replicaSet: 'rs' });
    var db = mongoose.connection;

    db.on('connected', function () {
        console.log(" - Mongoose default connection is open to ", mongoDB);
    });

    db.on('error', function (err) {
        console.log(" - Mongoose default connection has occured " + err + " error");
    });

    db.on('disconnected', function () {
        console.log(" - Mongoose default connection is disconnected");
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log(" - Mongoose default connection is disconnected due to application termination");
            process.exit(0);
        });
    });

    return db;
}

function close() {
    mongoose.connection.close();
    mongoose.connection.removeAllListeners();
}

module.exports = {
    connect,
    close
};
