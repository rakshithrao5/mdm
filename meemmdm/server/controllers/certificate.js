var mongoose = require('mongoose')
var Certificate = require('../models/certDB');
var profile = require('./profile');

module.exports.addCertEmail = function(email) {
    var crt = new Certificate();

    console.log('Here in addCertEmail');
    crt.addKeyEmail(email);
    profile.saveKeyEmail(email);
    console.log('Here in addCertEmail');

    crt.save(function(err){
        if(err)
            console.log('Error while saving the email key')
        else
            console.log('Email is successfully stored')
    });
}

module.exports.saveAPNCert = function(email, apnCert ,apnKey, onfinish){

    Certificate.findOne({adminKeyEmail : email}, function(err, crt){
        crt.addAPNCert(apnCert, apnKey);

        crt.save(function(err){
            if(err)
                console.log('Error while saving the APN cert')
            else
                console.log('APN is successfully stored')
                onfinish();
        });
    })
}

module.exports.addMobileConfig = function(email, mobileconfig){

    console.log('***')
    console.log(email)
    Certificate.findOne({adminKeyEmail : email}, function(err, crt){
        crt.addMobileConfig(mobileconfig);

        crt.save(function(err){
            if(err)
                console.log('Error while saving the mobile config')
            else
                console.log('mobileConfig is successfully stored')
        });
    })
}

module.exports.getAPNCert = function(email, cb){

    Certificate.findOne({adminKeyEmail : email}, 'apnCert apnKey', function(err, crt){

        if(err){
            console.log('Error while fetching the APN cert')
        } else
        cb(crt);
    });
}

module.exports.getMobConfig = function(email, cb){

    Certificate.findOne({adminKeyEmail : email}, 'mobConfigCert', function(err, crt){

        if(err){
            console.log('Error while fetching the APN cert')
        } else
        cb(crt); 
    });
}
