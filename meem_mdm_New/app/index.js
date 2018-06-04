var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
require('rootpath')();

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(bodyParser.text({ type: "*/*" }));


var security = require('./security/security');
var auth = require('./controller/auth/auth');
var enroll = require('./client/browser/enroll/index');
var profiles = require('./client/browser/profiles/index');

var pageloader = require('./controller/dummyfilerequests');
var mobile = require('./client/mobile/index');


router.use('/auth', auth);
router.use('/mdm', mobile);
router.use('/device', security.validate, mobile);
router.use('/enrollment', enroll);
router.use('/profiles', security.validate, profiles);
router.use('/pageloader', pageloader);

module.exports = router;
