var mongoose = require('mongoose');
var console = require('console');

var profileInfo = new mongoose.Schema({
    profilename:{
        type:String,
        unique:true,
        required:true
    },
    osversion:Number, //1- Apple, 2-Android, 3- Windows, 4-MacOS, 5-Linux
    description:String  
});

var passcodeProfile = new mongoose.Schema({
    profilename:{
        type:String,
        unique:true,
        required:true
    },
    allowSimple:Boolean,
    requireAlphanumeric:Boolean,
    minLength:Number,
    minComplexChars:Number,
    maxPINAgeInDays:Number,
    maxInactivity:Number,
    pinHistory:Number,
    maxGracePeriod:Number,
    maxFailedAttempts:Number
});

mongoose.model('profileinfo', profileInfo, 'profileinfo');
mongoose.model('passcodeprofile', passcodeProfile, 'passcodeprofile');
