var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
require('rootpath')();

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(bodyParser.text({ type: "*/*" }));


var apple =require('./apple/index');
//var android =require('./android/index');

router.use('/apple', apple);
//router.use('/android', android);

module.exports = router;