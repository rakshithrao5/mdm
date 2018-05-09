var express = require('express');
var app = express();
const router = express.Router();
var path = require('path');



const checkin = require('../controllers/mdmcheckin');
const server = require('../controllers/mdmserver');
const managedapp = require('../controllers/managedapp');


//  Connect all our routes to our application

router.get('/', function(req, res) {

  console.log("loading device page");
  res.sendFile(path.join(__dirname + '/../static/index.html'));
});

router.get('/enroll', function(req, res) {

  console.log("loading device page");
  res.sendFile(path.join(__dirname + '/../static/enrollmobile.html'));
});


router.get('/command-list', function(req, res) {

  console.log("loading send command page");
  res.sendFile(path.join(__dirname + '/../static/sendcommand.html'));
});

router.get('/profile', function(req, res) {

  console.log("loading send command page");
  res.sendFile(path.join(__dirname + '/../static/setprofile.html'));
});

router.get('/deleteprofile', function(req, res) {

  console.log("loading send command page");
  res.sendFile(path.join(__dirname + '/../static/deleteprofile.html'));
});


// router.get('/email-config', function(req, res) {

//   console.log("loading send command page");
//   res.sendFile(path.join(__dirname + '/../static/emailconf.html'));
// });



router.use('/checkin', checkin);
router.use('/server', server);
router.use('/managedapp',managedapp);
router.use('/apple',server);


module.exports = router;
