var mongoose = require('mongoose');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var console = require('console');
var device = require('./device');
var Profile = require('../models/profilesDB');
var authentication = require('./authentication');
const router = express.Router();

var fs = require('fs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text({ type: "*/*" }));

module.exports.saveKeyEmail = function (email) {
    var profile = new Profile();

    profile.addkeyEmail(email);

    profile.save(function (err) {
        if (err) {
            console.log('Error while saving add Key')
            console.log(err)
        } else {
            console.log('Key email is successfully saved')
        }
    });
}

module.exports.createProfileInfo = function (tokenID, reqBody) {

    profileInfo = {
        profilename : reqBody.profilename,
        description : reqBody.description
    };

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.update({ adminKeyEmail: email }, {'profileArray.profileInfo': profileInfo}, { upsert:true }, function (err) {
            if (err) {
                console.log('Error while updating the profileInfo')
                console.log(err)
            } else {
                console.log('Profile has been created!!')
            }
        })
    })
}

module.exports.updateProfileInfo = function (tokenID, reqBody) {

    profileInfo = {
        profileoldname : reqBody.profileoldname,
        profilenewname : reqBody.profilenewname,
        description    : reqBody.description
    }

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.update({ adminKeyEmail: email }, {'profileArray.profileInfo.profilename': profileInfo.profilenewname, 'profileArray.profileInfo.description': profileInfo.description}, false, function (err) {
            if (err) {
                console.log('Error while updating the profileInfo')
                console.log(err)
            } else {
                console.log('Profile has been updated!!')
            }
        });
    })
}

module.exports.deleteProfile = function (tokenID, profileUsrName) {
    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.update({ adminKeyEmail: email }, {'profileArray.profileInfo': null}, false, function (err) {
            if (err) {
                console.log('Error while deleting the profileInfo')
                console.log(err)
            } else {
                console.log('Profile has been deleted!!')
            }
        })
    })
}

module.exports.getRestrictionProfile = function(email, cb){
    Profile.find({adminKeyEmail: email}, 'profileArray.restrictionProfile', function(err , profile){
        if(err){
            console.log('Error while getting restriction profile')
        } else if(!profile){
            console.log('Profile is null');
        }else{

            json = profile[0].profileArray.restrictionProfile;


            var strjson = JSON.stringify(json);


            
            var json1 = JSON.parse(strjson);
            delete json1["_id"];

            console.log(JSON.stringify(json1));

            //console.log(JSON.stringify(json.PayloadContent[0]));
            
            cb(json1);
        }
    });    
}

module.exports.updateRestrictionProfile = function(email, restrictionProfile){

    Profile.update({ adminKeyEmail: email }, {'profileArray.restrictionProfile': restrictionProfile} , false, function (err) {
        if (err) {
            console.log('Error while updating the restrictionProfile')
            console.log(err)
        } else {
            console.log('Profile has been updated!!')
        }
    });
}



module.exports.getPassCodeProfile = function(email, cb){

    Profile.findOne({adminKeyEmail: email}, 'profileArray.passCodeProfile', function(err , profile){
        if(err){
            console.log('Error while getting passcode profile')
        } else if(!profile){
            console.log('Profile is null');
        }else{
            cb(profile);
        }
    });
}

module.exports.updatePasscodeProfile = function(email, passCodeProfile){

    Profile.update({ adminKeyEmail: email }, {'profileArray.passCodeProfile': passCodeProfile} , false, function (err) {
        if (err) {
            console.log('Error while updating the passcode profile')
            console.log(err)
        } else {
            console.log('Profile has been updated!!')
        }
    });
}

module.exports.getEmailProfile  = function(email, cb){
    Profile.findOne({adminKeyEmail: email}, 'profileArray.emailProfile', function(err , profile){
        if(err){
            console.log('Error while getting email profile')
        } else if(!profile){
            console.log('Profile is null');
        }else{

           // console.log(JSON.stringify(profile));

           var json = profile.profileArray.emailProfile;


            var strjson = JSON.stringify(json);


            
            var json1 = JSON.parse(strjson);
            delete json1["_id"];

            console.log('++++++++++++++++++++++++++++++');
            //fs.writeFileSync("/home/rakshith/email.log", JSON.stringify(json1));

            console.log(JSON.stringify(json1));
            
            cb(json1);
            //cb(profile);
        }
    });
}

module.exports.updateEmailProfie = function (email, emailProfile1) {

    console.log('Email');
    console.log('xyz' + email)

    console.log('Profile')
    console.log(JSON.parse(JSON.stringify(emailProfile1)));

    Profile.update({ adminKeyEmail: email }, {'profileArray.emailProfile': emailProfile1} , false, function (err) {
        if (err) {
            console.log('Error while updating the Email profile')
            console.log(err)
        } else {
            console.log('Profile has been updated!!')
        }
    });

    // console.log(email)
    // Profile.findOne({ adminKeyEmail: email }, function (err, profileList) {

    //     if (err) {
    //         console.log('Error while getting the profileList')
    //     } if (!profileList) {
    //         console.log('NULL PROFILE LIST')
    //     } else {

    //         // var string =JSON.stringify(profileList);
    //         // var myObj = JSON.parse(string);
    //         // console.log(myObj);

            
    //         //profileList.emailProfile = emailProfile1.PayloadContent;
    //         profileList.emailProfile = {EmailAccountDescription": "xyza", "EmailAccountName": "qwerty"};

    //         console.log('Got the email entry');
    //         console.log(email);
    //         profileList.save(function (err) {
    //             if (err) {
    //                 console.log('Error while saving')
    //                 console.log(err)
    //             } else {
    //                 console.log('Profile successfully updated')
    //             }
    //         })
    //     }
    // })
}


// module.exports.handleProfileRequest = function (req, res) {

//     authentication.fetchEmailByTokenId(req.query.tokenID, function (email) {

//         if (res.query.action == 'create') {
//             createProfileInfo(email, req.body);
//         } else if (res.query.action == 'update') {
//             updateProfileInfo(email, req.body);
//         } else if (res.query.action == 'delete'){
//             deleteProfile()
//         }
// }

// router.use('/create', createProfileInfo);
// router.use('/update', updateProfileInfo);
// router.use('/delete', deleteProfile);

// module.exports = {
//     router: router,
//     saveKeyEmail: saveKeyEmail,
//     createProfileInfo:createProfileInfo,
//     updateProfileInfo:updateProfileInfo,
//     deleteProfile:deleteProfile,
//     updateEmailProfie: updateEmailProfie,
//     getEmailProfile:getEmailProfile
// };
// router.use('/email', )