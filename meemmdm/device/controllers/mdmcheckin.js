var express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');

var device = require('../../server/controllers/device')
var authentication = require('../../server/controllers/authentication')

var app = express();
var fs = require('fs');
var plist = require('plist');


var bodyParser = require('body-parser')
var multer = require('multer')


// parse application/json
router.use(bodyParser.json())
router.use(bodyParser.text({ type: "*/*" }));
require('body-parser-xml')(bodyParser);

/*Checkin*/

function downloadMDMProfile(req, res) {

    console.log("download profile!");

    var file = __dirname + '/../../plists/enroll/Enroll.mobileconfig';
    res.download(file); // Set disposition and send it.
}

function downloadMDMCA(req, res) {


    console.log("downloadCA!");
    var file = __dirname + '/../../certs/ssl/CA.crt';
    res.download(file); // Set disposition and send it.

}


function processMDMCheckinCommand(req, res) {

    console.log("processCheckinCommand!");

    if (!req.body) return res.sendStatus(400)

    var string = JSON.stringify(req.body);
    var myObj = JSON.parse(string);

    var keys = myObj["plist"]["dict"]["key"];
    var strings = myObj["plist"]["dict"]["string"];

    //console.log("Data: " + string);
    //console.log("Plist: "+plist.build(myObj));
    var status = 0;

    for (var key in keys) {
        var token = keys[key];
        if (token == "AwaitingConfiguration")
            status = 1;
    }

    for (var key in keys) {

        var token = keys[key];
        // console.log(token);
        if (token == "MessageType") {

            var MessageType = strings[key];
            if (status == 1)
                MessageType = strings[key - 1];

            if (MessageType == "Authenticate") {
                console.log("Authenticate Message!");

                authentication.getTokenID(function (id) {
                    authentication.fetchEmailByTokenId(id.authID, function (email) {
                        device.saveAuthenticationDetail(email, myObj);
                    })
                })

                fs.writeFile("./plists/checkin/Authenticate.plist", plist.build(myObj), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Authenticate file saved!");
                });
            }
            else if (MessageType == "TokenUpdate") {
                console.log("Device Enrolled! TokenUpdate Received");

                authentication.getTokenID(function (id) {
                    authentication.fetchEmailByTokenId(id.authID, function (email) {
                        device.saveTokenUpdate(email, myObj);
                    })
                })
                fs.writeFile("./plists/checkin/TokenUpdate.plist", plist.build(myObj), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("TokenUpdate file saved!");
                });
            }
            else {
                console.log(MessageType);
            }
        }
    }
    res.end();


}



// router.get('/enroll', function(req, res) {
//     res.sendFile(path.join(__dirname + '/../static/enrollmobile.html'));
// });

router.get('/download-profile', downloadMDMProfile);
router.get('/download-CA', downloadMDMCA);


router.put('/', bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB 
    xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes 
        normalizeTags: true, // Transform tags to lowercase 
        explicitArray: false // Only put nodes in array if >1 
    }
}), processMDMCheckinCommand);


module.exports = router;

