var express = require('express');
var router =  express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlAuth = require('../controllers/authentication');
var ctrlProfile = require('../controllers/profile');

router.post('/auth/', ctrlAuth.authentication);
router.post('/profile/', ctrlProfile.profile);

module.exports = router;
