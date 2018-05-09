var express = require('express');
var router =  express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var path = require('path');

var ctrlAuth = require('../controllers/authentication');
var ctrlProfile = require('../controllers/profile');
var enrollment = require('../controllers/enrollment');
var device = require('../../device/routes/index');



// router.get('/', function(req, res) {

//   var tokenID= req.query.tokenID;
//   console.log("tokenID: "+tokenID);

//   if(authentication.verifyTokenID(tokenID, function(bool){
//     if(bool){
                        
//       console.log('Token: '+tokenID +' Verified');
//       res.sendFile(path.join(__dirname + '/../static/enroll.html'));

//     } else{
    
//       console.log('Token: '+tokenID +' Mismatch');
//       res.sendFile(path.join(__dirname + '/../static/login.html'));
    
//     }
//   }));

// });

router.use('/auth', ctrlAuth.router);
//router.use('/profile/', ctrlProfile.router);
router.use('/enrollment', enrollment);

//  Connect all our routes to our application
router.use('/mdm', device);
router.use('/device', device);


module.exports = router;
