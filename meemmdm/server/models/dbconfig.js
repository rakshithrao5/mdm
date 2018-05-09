var mongoose = require('mongoose');
var winston = require('../../logconfig/winston');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/meemgdpr';
winston.log("info","Mongoose DB ");
mongoose.connect(process.env.CUSTOMCONNSTR_MongolabUri || dbURI);
// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    winston.log("info","Mongoose connected to ");
});
mongoose.connection.on('error', function(err) {
    winston.log("info","Mongoose connection error: " + err);
});
mongoose.connection.on('disconnected', function() {
    winston.log("info","Mongoose disconnected");
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        winston.log("info","Mongoose disconnected through " + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    winston.log("info","Mongoose graceful shutdown " + msg);
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    winston.log("info","Mongoose terminated " + msg);
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
//process.on('SIGTERM', function() {
//  gracefulShutdown('Heroku app termination', function() {
//    process.exit(0);
//  });
//});

// BRING IN YOUR SCHEMAS & MODELS
require('./authDB');
require('./devicesDB');
require('./profilesDB');


