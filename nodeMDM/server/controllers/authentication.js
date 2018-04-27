var mongoose = require('mongoose');
var User = mongoose.model('user');
var console = require('console');

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
    if((!req.body.username)||(!req.body.password)||(!req.body.email)){
        sendJSONResponse(res, 401,{
            "message":"UnAuthorized, all fields are required"
        });
        return;
    }
    
    /*Checking if email exists in DB*/
    User.findOne({email: req.body.email}, function(err, retQuery){
        if(err){
            console.log("error in finding email from DB");
            return;
        }
        if(!retQuery){//if email does not exist in DB
            var user = new User();
            user.email = req.body.email;
            user.username = req.body.username;

            user.SetPassword(req.body.password);
            var authID = user.generateJWT();
            /* Saving the params to DB and 
             * returning tokenID in JSON as
             * reponse
             * */
            user.save(function(err){
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
};
/*
 * Login to the system
 * @param email - Registered email ID. 
 * @param password -  Registered password
 * @returns tokenID - created using Json Web Token library
 */
var authLogin = function(req, res){
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

module.exports.authentication = function(req, res){
	console.log('Auth request param: %s', req.query.action);
	if(req.query.action === 'register'){
		authRegister(req, res);
		return;
	} else if (req.query.action === 'login'){
		authLogin(req, res);
		return;
	} else if (req.query.action === 'logout'){
		authLogout(req, res);
		return;	
	} else if (req.query.action === 'changepassword'){
        changePassword(req, res);
        return;
    } else if(req.query.action === 'deregister'){
        deregisterUser(req, res);
    }
};