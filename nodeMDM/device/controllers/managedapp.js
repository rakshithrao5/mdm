var express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');

var status = true;

function sendManifest(req,res) {
  
    console.log("Request, Sending Manifest!");
    var file = __dirname + '/../../managedapp/manifest.plist';
    res.download(file); // Set disposition and send it.
   
}

function sendManagedApp(req,res) {
  
    console.log("Request, Sending App!");
    var file = __dirname + '/../../managedapp/meem.ipa';
    res.download(file); // Set disposition and send it.
}

function sendImage57(req,res) {
  
    console.log("Sending Image 57!");
    var file = __dirname + '/../../managedapp/images/image57.png';
    res.download(file); // Set disposition and send it.
}

function sendImage512(req,res) {
  
    console.log("Sending Image 512!");
    var file = __dirname + '/../../managedapp/images/image512.png';
    res.download(file); // Set disposition and send it.
}

router.get('/manifest.plist',sendManifest);
router.get('/meem.ipa',sendManagedApp);
router.get('/images/image57.png',sendImage57);
router.get('/images/image512.png',sendImage512);

module.exports = router;



