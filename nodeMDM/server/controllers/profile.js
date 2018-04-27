var mongoose = require('mongoose');
//var express = require("express");
//var app = express();
//var bodyParser = require('body-parser');
var console = require('console');
var device = require('./device');
var passcodeprofile = mongoose.model('passcodeprofile');
var profileinfo = mongoose.model('profileinfo');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

var sendResponse = function(res, status){
    res.status(status).send();
};
var sendJSONResponse = function(res, status, content){
	res.status(status);
	res.json(content);
};
module.exports.profile = function(req, res){
    console.log('Inside profile param');
    console.log('version %s', req.body.version.osversion);
    //passcodeprofile.findOne({profilename:req.body.profilename}, function(err, query){
    //    query.update(req.body,function(err){
    //        sendJSONResponse(res, 201, {
    //            "profilename":req.body.profilename	
    //        }); 
    //    });
    //});
    //need to check if profile name exists, if it does not
    //then, we need to create new instance and use 'save'.
    //if profile exists, we need to use 'update' and pass req.body
    var profile = new profileinfo(req.body);
    profile.save(function(err){
        sendJSONResponse(res, 201, {
            "profilename":req.body.profilename	
        }); 
    });
    //device.sendrequest(req, res, function(req, res){
    //    sendResponse(res, 200);
    //});
};
