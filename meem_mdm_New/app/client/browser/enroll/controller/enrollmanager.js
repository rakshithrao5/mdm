require('rootpath')();
var path = require('path')
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');
var generatecsr = require('./genCsrPlist')
var genenrollmobileconfig = require('./genEnrollMobileConfig')

var certificate = require('app/model/api/certificate')
var authentication = require('app/model/api/authentication')
var device = require('app/model/api/device')

var winston = require('config/logconfig/winston');


function getHash(email) {
    var hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
}

exports.EnrollDevice = function (req, res) {

    if (!req.body) return res.sendStatus(406)


    var tokenID = req.body.tokenID;
    console.log('Token: ' + tokenID);

    console.log('Enroll Device');

    var string = JSON.stringify(req.body);

    console.log('Data:' + string);
    var myObj = JSON.parse(string);

    var keys = Object.keys(myObj);
    console.log('keys:' + keys);
    keys.forEach(function (item) {
        // 	console.log('objects :' + item);
        if (item == "tokenID") {
            console.log('item:' + item);

        }
        else if (item == "type") {
            console.log('item:' + item);

        } else if (item == "req") {
            console.log('item:' + item);

            var reqObj = myObj[item];
            var keys = Object.keys(reqObj);
            // console.log('Req keys:'+ keys);


            keys.forEach(function (req) {

                if (req == "name") {

                    name = reqObj[req];
                }
                else if (req == "email") {
                    email = reqObj[req];
                }
                else if (req == "countrycode") {
                    countrycode = reqObj[req];
                }


            })

            console.log('Name : ' + name);
            console.log('Email : ' + email);
            console.log('Country Code : ' + countrycode);

            if (name.length && email.length) {

                onPushcsrGeneration = function (status) {
                    if (status) {
                        console.log("******* Push csr Generated ******* ");
                        var resJson = {
                            "link": "https://idmsa.apple.com/IDMSWebAuth/login?appIdKey=3fbfc9ad8dfedeb78be1d37f6458e72adc3160d1ad5b323a9e5c5eb2f8e7e3e2&rv=2"
                        }
                        res.send(resJson);
                        res.end();

                    } else {
                        console.log("push csr generation failed");
                    }
                }

                authentication.fetchHashByTokenId(tokenID, function (hash) {

                    generatecsr.entrypoint(email, countrycode, hash, onPushcsrGeneration);
                })

            }
            else {

                if (!name.length) {
                    res.send("Name field is Empty");

                }
                else if (!email.length) {
                    res.send("Email field is Empty");

                }
                res.end();
            }
        }
    })
}

exports.ListDevices = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('List Enrolled Devices');

    device.listdevices(function (deviceList) {
        console.log('The device list is sent')

        res.status(200);
        res.send(deviceList);

    });

};


exports.ListEnrollmentSettings = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('List Enrollment settings');


    res.status(200);
    var jsonresp = { "OTP": "dummy" };
    res.send(jsonresp);

};


exports.DownloadPushCsr = function (req, res) {

    console.log("Download Unsigned push CSR!");
    var tokenID = req.query.tokenID;
    console.log('Token: ' + tokenID);

    authentication.fetchHashByTokenId(tokenID, function (hash) {

        var pushcsrpath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/csr-file-to-upload/applepush.csr";

        if (fs.existsSync(pushcsrpath)) {

            console.log("Push Csr Exists!!")
            res.download(pushcsrpath); // Set disposition and send it.

        }
        else {
            console.log("Push Csr DOESNTExists!!")

            res.sendStatus(404)
        }
    })


};

exports.DownloadEnrollProfile = function (req, res) {

    console.log("Download Enroll Profile!");

    var tokenID = req.query.tokenID;
    console.log('Token: ' + tokenID);

    var string = JSON.stringify(req.query)
    var myObj = JSON.parse(string);
    console.log(myObj);

    authentication.fetchHashByTokenId(tokenID, function (hash) {

        var enrollconfigpath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/plists/enroll/Enroll.mobileconfig";

        if (fs.existsSync(enrollconfigpath)) {

            console.log("Enroll Profile Exists!!")
            res.download(enrollconfigpath); // Set disposition and send it.

        }
        else {
            console.log("Enroll Profile DOESNTExists!!")

            res.sendStatus(404)
        }
    })
};

exports.DownloadCA = function (req, res) {

    console.log("Download CA Cert!");

    var string = JSON.stringify(req.query)
    var myObj = JSON.parse(string);
    console.log(myObj);
    var CACertpath = 'vendor/certs/ssl/CA.crt'

    if (fs.existsSync(CACertpath)) {

        console.log("CA Cert Exists!!")
        res.download(CACertpath); // Set disposition and send it.

    }
    else {
        console.log("CA Cert DOESNTExists!!")
        res.sendStatus(404)
    }

};


exports.onPushCsrUploadCompleted = function (req, res) {

    console.log("Push Cert Uploaded");
    var tokenID = req.body.tokenID;
    console.log('Token: ' + tokenID);

    authentication.fetchHashByTokenId(tokenID, function (hash) {

        var currUploadPath = global.__basedir + '/tmp/PushCert.pem';
        var newUploadPath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + '/uploads/PushCert.pem';


        console.log("currUploadPath: " + currUploadPath);
        console.log("newUploadPath: " + newUploadPath);


        fs.createReadStream(currUploadPath).pipe(fs.createWriteStream(newUploadPath));

        apnskeyPath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/csr-file-to-upload/PushCert.key";
        apnscerPath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/uploads/PushCert.pem";

        console.log("apnscerPath: " + apnscerPath);
        console.log("apnskeyPath: " + apnskeyPath);

        authentication.fetchEmailByTokenId(tokenID, function (email) {

            certificate.saveAPNCert(email, fs.readFileSync(apnscerPath), fs.readFileSync(apnskeyPath), function () {

                var onEnrollMobileConfigGeneration = function (status) {
                    if (status) {
                        console.log("******* Enroll mobile config Generated ******* ");
                        res.end('File is uploaded. iOS Enroll link:http://www.codeswallop.com/meem/device/enroll')

                    } else {

                        console.log("Enroll mobile config generation failed");
                        res.end('File is uploaded, iOS Enroll generation failed')

                    }
                }
                genenrollmobileconfig.entrypoint(tokenID, hash, onEnrollMobileConfigGeneration);
            });
        })
    })

}


