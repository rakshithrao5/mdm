var express = require('express');
var app = express();
const router = express.Router();
var path = require('path');



const checkin = require('../controllers/mdmcheckin');
const server = require('../controllers/mdmserver');
const managedapp = require('../controllers/managedapp');


//  Connect all our routes to our application

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/../static/index.html'));
});

router.use('/checkin', checkin);
router.use('/server', server);
router.use('/managedapp',managedapp);


module.exports = router;
