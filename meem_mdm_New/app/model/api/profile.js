var Profile = require('app/model/schema/profileDB')
var authentication = require('app/model/api/authentication')

// module.exports.saveKeyEmail = function (email) {
//     var profile = new Profile();

//     profile.addkeyEmail(email);

//     profile.save(function (err) {
//         if (err) {
//             console.log('Error while saving add Key')
//             console.log(err)
//         } else {
//             console.log('Key email is successfully saved')
//         }
//     });
// }

module.exports.createProfile = function (tokenID, profileInfo, cb) {

    authentication.fetchIdByTokenId(tokenID, function (Id) {


        var profile = new Profile({'profileInfo': profileInfo,
                                    'admin': Id});

        profile.save(function (err) {
            if (err) {
                console.log('Error while saving profile info ' + err);
                cb(false);
            }
            else {
                console.log('Profile info is saved');
                cb(true);
            }
        })
    })
}

module.exports.updateProfile = function (tokenID, profileInfo) {

    var json = {
        'profilename': profileInfo.profilenewname,
        'OS': profileInfo.OS,
        'description': profileInfo.description
    }

    authentication.fetchIdByTokenId(tokenID, function (Id) {
        Profile.findOne({ 'profileInfo.profilename': profileInfo.profileoldname, 'admin': Id},
            function (err, profile) {

                profile.profileInfo = json;
                profile.save(function (err) {
                    if (err)
                        console.log('Error while editing profile info ' + err);
                    else {
                        console.log('Profile info is saved');
                    }
                })
            })
    })
}

module.exports.deleteProfile = function (tokenID, profilename) {
    authentication.fetchIdByTokenId(tokenID, function (Id) {
        Profile.findOne({ 'profileInfo.profilename': profilename, 'admin': Id},
            function (err, profile) {

                profile.remove();
                profile.save(function (err) {
                    if (err)
                        console.log('Error while editing profile info ' + err);
                    else {
                        console.log('Profile info is saved');
                    }
                })
            })
    })
}

module.exports.setEmailProfile = function (tokenID, profilename, emailProfile) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setEmailProfile(emailProfile);

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving emailProfile ' + err);
                    else {
                        console.log('emailProfile stored')
                    }
                });
            }
        })
    })
}

module.exports.setPasscodeProfile = function (tokenID, profilename, passcodeProfile) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setPasscodeProfile(passcodeProfile);

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving passcodeProfile ' + err);
                    else {
                        console.log('passcodeProfile SUCCESSFULY stored')
                    }
                });
            }
        })
    })
}

module.exports.setRestrictionProfileDefault = function (tokenID, profilename, restrictionProfileDefault) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {

        console.log('Email: ' + email + '    ' + profilename);
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {

                console.log('setRestrictionProfileDefault, profile: ' + JSON.stringify(profile));
                profile.profileArray[0].setRestrictionProfileDefault(restrictionProfileDefault);

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving restrictionProfile ' + err);
                    else {
                        console.log('restrictionProfile SUCCESSFULY stored')
                    }
                });
            }
        })
    })
}


module.exports.setRestrictionProfileFunctionality = function (tokenID, profilename, restrictionProfileFunctionality) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setRestrictionProfileFunctionality(restrictionProfileFunctionality);

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving restrictionProfile ' + err);
                    else {
                        console.log('restrictionProfile SUCCESSFULY stored')
                    }
                });
            }
        })
    })
}
module.exports.setRestrictionProfileSecurity = function (tokenID, profilename, restrictionProfileSecurity) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setRestrictionProfileSecurity(restrictionProfileSecurity);

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving restrictionProfile ' + err);
                    else {
                        console.log('restrictionProfile SUCCESSFULY stored')
                    }
                });
            }
        })
    })
}

module.exports.setRestrictionProfileAdvancedSecurity = function (tokenID, profilename, restrictionProfileAdvancedSecurity) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setRestrictionProfileAdvancedSecurity(restrictionProfileAdvancedSecurity);

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving restrictionProfile ' + err);
                    else {
                        console.log('restrictionProfile SUCCESSFULY stored')
                    }
                });
            }
        })
    })
}

module.exports.getEmailProfile = function (tokenID, profileName, emailProfileCB) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email }, { '_id': 0, '__v': 0 }, function (err, profile) {
            if (err) {
                console.log('Error while getting email profile')
            } else if (!profile) {
                console.log('Profile is null');
            } else {

                var emailJson = JSON.stringify(profile.profileArray[0].emailProfile);
                var emailParsedJson = JSON.parse(emailJson);

                emailProfileCB(emailParsedJson);
            }
        })
    })

}

module.exports.getPasscodeProfile = function (tokenID, profileName, passcodeProfileCB) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {

        Profile.findOne({ 'adminKeyEmail': email }, { '_id': 0, '__v': 0 }, function (err, profile) {
            if (err) {
                console.log('Error while getting email profile')
            } else if (!profile) {
                console.log('Profile is null');
            } else {

                var passcodeJson = JSON.stringify(profile.profileArray[0].passcodeProfile);
                var passcodeParsedJson = JSON.parse(passcodeJson);
                passcodeProfileCB(passcodeParsedJson);
            }
        })
    })
}

module.exports.getRestrictionProfile = function (tokenID, profileName, restrictionProfileCB) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {

        Profile.findOne({ 'adminKeyEmail': email }, { '_id': 0, '__v': 0 }, function (err, profile) {
            if (err) {
                console.log('Error while getting email profile')
            } else if (!profile) {
                console.log('Profile is null');
            } else {
                //console.log('% '+profile.profileArray[0].restrictionProfile)

                var restrictionJson = JSON.stringify(profile.profileArray[0].restrictionProfile);
                var restrictionParsedJson = JSON.parse(restrictionJson);
                restrictionProfileCB(restrictionParsedJson);
            }
        })
    })
}

module.exports.getProfiles = function (tokenID, profileName, profilesCB) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {

        console.log('111')
        Profile.findOne({ 'adminKeyEmail': email }, { '_id': 0, '__v': 0 }, function (err, profile) {
            if (err) {
                console.log('Error while getting email profile')
            } else if (!profile) {
                console.log('Profile is null');
            } else {

                console.log('222')


                var profileIdentifierJson = JSON.stringify(profile.profileArray[0].profileInfo);
                var profileIdentifierParsedJson = JSON.parse(profileIdentifierJson);

                var emailJson = JSON.stringify(profile.profileArray[0].emailProfile);
                var emailParsedJson = JSON.parse(emailJson);

                var passcodeJson = JSON.stringify(profile.profileArray[0].passcodeProfile);
                var passcodeParsedJson = JSON.parse(passcodeJson);

                var restrictionJson = JSON.stringify(profile.profileArray[0].restrictionProfile);
                var restrictionParsedJson = JSON.parse(restrictionJson);

                var webclipJson = JSON.stringify(profile.profileArray[0].webClipProfile);
                var webclipParsedJson = JSON.parse(webclipJson);

                profilesCB(profileIdentifierParsedJson, emailParsedJson, passcodeParsedJson,webclipParsedJson,restrictionParsedJson);
            }
        })
    })
}

module.exports.deregisterAdmin = function(email){
    Profile.deleteOne({'adminKeyEmail': email}, function(err){
        if(err){
            console.log('Error in droping the profile details of '+email)
        } else
            console.log('Droping profile detail success for '+email)
    })
}

module.exports.setiCloudProfile = function (tokenID, profilename, iCloudProfile) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setiCloudProfile(iCloudProfile);

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving iCloudProfile ' + err);
                    else {
                        console.log('iCloudProfile stored')
                    }
                });
            }
        })
    })
}

module.exports.setWebClipProfile = function (tokenID, profilename, webClipProfile) {


    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setWebClipProfile(webClipProfile);

                profile.save(function (err) {
                    if (err)
                        console.log('Error while saving webClipProfile ' + err);
                    else {
                        console.log('webClipProfile stored')
                    }
                });
            }
        })
    })
}


module.exports.setBrowserProfile = function (tokenID, profilename, browserProfile) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setBrowserProfile(browserProfile);

                profile.save(function (err) {
                    if (err)
                    console.log('Error while saving browserProfile ' + err);
                    else {
                        console.log('browserProfile stored')
                    }
                });
            }
        })
    })
}

module.exports.setNetworkProfile = function (tokenID, profilename, networkProfile) {

    authentication.fetchEmailByTokenId(tokenID, function (email) {
        Profile.findOne({ 'adminKeyEmail': email, 'profileArray.profileInfo.profilename': profilename }, function (err, profile) {
            if (err) {
                console.log('The error while fetching ' + err)
            }
            if (profile.profileArray[0]) {
                //console.log('The device onject is not null in tokenUpdates');
                profile.profileArray[0].setNetworkProfile(networkProfile);

                profile.save(function (err) {
                    if (err)
                    console.log('Error while saving networkProfile ' + err);
                    else {
                        console.log('networkProfile stored')
                    }
                });
            }
        })
    })
}





