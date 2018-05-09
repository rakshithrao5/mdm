var mongoose = require('mongoose');
var User = require('../models/authDB');
var console = require('console');
var express = require('express');
var router =  express.Router();
var app = express();
var certificate = require('./certificate');
//var profile = require('./profile');
var device = require('./device');
var path = require('path');
//var appRoot = require('app-root-path');
var winston = require('../../logconfig/winston');


 var bodyParser = require('body-parser');
 app.use(bodyParser.json()); // support json encoded bodies
 app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/*
 * Send response in JSON format 
 */
var sendJSONResponse = function(res, status, content){
	res.status(status);
	res.json(content);
};

var sendResponse = function(res, status){
    res.status(status).send();
};

/*
 * Register new email ID in the system
 * @param username - Name entered on the registration page
 * @param email - Email entered on the registration page. 
 * @param password -  Password entered by the user
 * @returns tokenID - created using Json Web Token library
 */
var authRegister = function(req, res){
    winston.log('info', 'inside register');
    if((!req.body.username)||(!req.body.password)||(!req.body.email)){
        winston.log("error","all fields required")
        sendJSONResponse(res, 401,{
            "message":"UnAuthorized, all fields are required"
        });
        return;
    }
    winston.log("info","check DB email")
    winston.log("info", req.body.username)
    /*Checking if email exists in DB*/
    User.findOne({email: req.body.email}, function(err, retQuery){
        console.log("email", req.body.email)
        if(err){
            winston.log("error in finding email from DB");
            return;
        }
        winston.log("info","done finding")
        if(!retQuery){//if email does not exist in DB
            winston.log("info","inside retquery")
            var user = new User();
            user.email = req.body.email;
            user.username = req.body.username;


            certificate.addCertEmail(req.body.email);
            //profile.saveKeyEmail(req.body.email);
            device.saveKeyEmail(req.body.email);
            user.SetPassword(req.body.password);
            var authID = user.generateJWT();
            user.authID = authID;
            /* Saving the params to DB and 
             * returning tokenID in JSON as
             * reponse
             * */
            user.save(function(err){
                if(err){
                    console.log('Error while registering')
                }
                sendJSONResponse(res, 201, {
                    "tokenID":authID	
                }); 	
            });
            return;
        }
        /* If email already exists, return 401 status*/
        if(retQuery.email == req.body.email){
            sendJSONResponse(res, 401,{
                "message":"email ID already registered"
            });
            return;
        }
    });	
    winston.log("erro","exiting register function")		
};
/*
 * Login to the system
 * @param email - Registered email ID. 
 * @param password -  Registered password
 * @returns tokenID - created using Json Web Token library
 */
var authLogin = function(req, res){

    console.log('in login')
    console.log('password: ',req.body.password);
    console.log('username: ',req.body.username);
    console.log('email: ',req.body.email);

	if((!req.body.email)||(!req.body.password)){
		sendJSONResponse(res, 401,{
				"message":"UnAuthorized, all fields are required"
				});
		return;
	}
    /*Checking if email exists in DB*/
    User.findOne({email: req.body.email}, function(err, retQuery){
        if(err){
            console.log("error in finding email in DB");
            return;
        }
        if(!retQuery){
            console.log("email not present");
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, emailID not registered"
            });
            return;
        }
        
        if(!retQuery.verifyPassword(req.body.password)){
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, password not matching"
            });
            return;
        }	
        var authID = retQuery.generateJWT();
        retQuery.update({authID: authID}, function(err, authQuery){
            if((err) || (!authQuery)){
                sendJSONResponse(res, 401,{
                    "message":"UnAuthorized, Unable to generate tokenID"
                }); 
            }
            if(authQuery){
                sendJSONResponse(res, 201, {
                    "tokenID":authID	
                });
            }
        });
    });
};

/*
 * Logout of the system
 * @param tokenID - JWT 
 */
var authLogout = function(req, res){
    console.log('Logout API');

    User.findOne({authID: req.body.tokenID}, function(err, retQuery){
        if(err){
            console.log("error in finding email in DB");
            return;
        }
        if(!retQuery){
            console.log("authID not present");
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, authID not present"
            });
            return;
        }
        
        var authID = 0;
        retQuery.update({authID: authID}, function(err, authQuery){
            if((err) || (!authQuery)){
                sendResponse(res, 401)
            }
            if(authQuery){
                sendResponse(res, 200);
            }
        });
    });
};

/*
 * Change the password for the system
 * @param email - registered emailID
 * @param oldpassword - Currently registered password
 * @param newpassword - Newly created password
 * return @param tokenID - JWT 
 */
var changePassword = function(req, res){
    console.log('Change Password');
    if((!req.body.email)||(!req.body.oldpassword)||(!req.body.newpassword)){
        sendJSONResponse(res, 401,{
            "message":"UnAuthorized, all fields are required"
				});
		return;
	}
    /*Checking if email exists in DB*/
    User.findOne({email: req.body.email}, function(err, retQuery){
        if(err){
            console.log("error in finding email in DB");
            return;
        }
        if(!retQuery){
            console.log("email not present");
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, emailID not registered"
            });
            return;
        }
        if(!retQuery.verifyPassword(req.body.oldpassword)){
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, oldpassword not matching"
            });
            return;
        }
        retQuery.SetPassword(req.body.newpassword);
        var authID = retQuery.generateJWT();
        retQuery.update({salt:retQuery.salt,hash:retQuery.hash,authID:authID},function(err, passQuery){
            if((err) || (!passQuery)){
                sendJSONResponse(res, 401,{
                    "message":"UnAuthorized, Unable to generate tokenID"
                }); 
            }
            if(passQuery){
                sendJSONResponse(res, 201, {
                    "tokenID":authID	
                });
            }  
        });
    });
};

/*
 * De-register user from the system
 * @param email - registered emailID
 * @param tokenID - JWT 
 * Return Success/Failure
 */
var deregisterUser = function(req, res){
    console.log('De-register');
    User.findOne({authID: req.body.tokenID}, function(err, retQuery){
        if(err){
            console.log("error in finding email in DB");
            return;
        }
        if(!retQuery){
            console.log("authID not present");
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, authID not present"
            });
            return;
        }

        retQuery.remove(function(err, authQuery){
            if((err) || (!authQuery)){
                sendResponse(res, 401)
            }
            if(authQuery){
                sendResponse(res, 200);
            }
        });
    });
};


var verifyTokenID = function(tokenID, cb){
  
    User.findOne({authID : tokenID}, function(err, id){
        if(err){
            console.log('Error in getting tokenID')
        } 
        if(!id){
            console.log('Token id is not found')
            //return false;
            cb(false);
        } else {
             console.log('Token Id is present')
            cb(true);
        }
    });
}

var getTokenID = function(cb){

       User.findOne({}, 'authID', function(err, id){
        if(err){
            console.log('Error')
        } else{
            console.log(id);
            console.log(id.authID);
            cb(id);
        }
    })
}

var fetchEmailByTokenId = function(tokenID, email){

    console.log('The tokn ID is')
    console.log(tokenID)

    User.findOne({authID : tokenID}, 'email', function(err, emailObj){
        if(err){
            console.log('Error in getting email ID by TOKEN');
        }
        console.log('GOT THE MOBILE ID')
        ret = JSON.stringify(emailObj);
        myObj = JSON.parse(ret);
        console.log(ret);
        email(emailObj.email);
    })
}

router.use('/login', authLogin)

router.use('/register', authRegister)

router.use('/logout', authLogout)

router.use('/changepassword', changePassword)

router.use('/deregister', deregisterUser)

/**Loading Pages */

router.get('/sign-in', function name(req, res) {     
    winston.log("info","inside signin request")
    res.sendFile(path.join(__dirname + '/../static/login.html'));

    
})
router.get('/sign-up', function name(req, res) {
    winston.log("info","inside signup request")

    res.sendFile(path.join(__dirname + '/../static/register.html'));

})

module.exports = {
    router:router,
    verifyTokenID: verifyTokenID,
    getTokenID:getTokenID,
    fetchEmailByTokenId : fetchEmailByTokenId
}

