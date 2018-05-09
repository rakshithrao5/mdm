var express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');




var generatecsr = require('../../GenPushCsr/genCsrPlist');
var applecert = require('./applecert');
var authentication = require('./authentication');
var cert = require('./certificate');
var device = require('./device')

var name = "";
var email = "";
var countrycode = "";

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(bodyParser.text({ type: "*/*" }));


require('body-parser-xml')(bodyParser);

router.get('/enroll-form', function(req, res) {

    console.log("enroll-form");
    res.sendFile(path.join(__dirname + '/../static/enroll.html'));
  
});



router.get('/listdevices', function(req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('List Enrolled Devices');
    
    var tokenID = req.query.tokenID;

    authentication.verifyTokenID(tokenID, function(bool){
        if(bool){
                            
            console.log('Token: '+tokenID +' Verified');
            device.listdevices(function(deviceList){
                console.log('The device list is sent')

                res.status(200);
	            res.send(deviceList);

            });

        } else{
        
            console.log('Token: '+tokenID +' Mismatch');
            res.sendStatus(406);
        }
    });
   
});


router.get('/settings', function(req, res) {
    if (!req.body) return res.sendStatus(406)
    
    console.log('List Enrollment settings');
    var tokenID = req.query.tokenID;
    authentication.verifyTokenID(tokenID, function(bool){
          if(bool){
                              
            console.log('Token: '+tokenID +' Verified');
            
            res.status(200);
            var jsonresp = {"OTP": "dummy"};
	        res.send(jsonresp);

          } else{
          
            console.log('Token: '+tokenID +' Mismatch');
            res.sendStatus(404);
          }
    });


});

function downloadPushCsr(req, res) {

    var file = path.join(__dirname + '/../../GenPushCsr/csr-file-to-upload/applepush.csr');

    console.log("Download Unsigned push CSR!");

    var tokenID = req.query.tokenID;

    var string = JSON.stringify(req.query)
    var myObj  = JSON.parse(string);
    console.log(myObj);

    // authentication.verifyTokenID(tokenID, function(bool){
            
    //       if(bool){
                              
         //   console.log('Token: '+tokenID +' Verified');
            if (fs.existsSync(file)) {

                console.log("Push Csr Exists!!")
                res.download(file); // Set disposition and send it.

            }
            else{
                console.log("Push Csr DOESNTExists!!")

                res.sendStatus(404)
            }

    //       } else{
          
    //           console.log('Token: '+tokenID +' Mismatch');
    //           res.sendStatus(404);
    //         }
    // });
    
}


router.get('/appleCSR', downloadPushCsr);

router.post('/enroll', function(req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('Enroll Device');

    var tokenID = req.body.tokenID;

    console.log(tokenID);
    authentication.verifyTokenID(tokenID, function(bool){

          if(bool){
                              
            console.log('Token: '+tokenID +' Verified');
            var string = JSON.stringify(req.body);
    
        console.log('Data:'+ string);
        var myObj = JSON.parse(string);
        

        var keys = Object.keys(myObj);
        console.log('keys:'+ keys);
        keys.forEach(function(item){
            // 	console.log('objects :' + item);
            if(item == "tokenID"){
                console.log('item:'+ item);

            }
            else if (item == "type") {
                console.log('item:'+ item);

            } else if (item == "req") {
                console.log('item:'+ item);

                var reqObj =  myObj[item];
                var keys = Object.keys(reqObj);
            // console.log('Req keys:'+ keys);

            
                keys.forEach(function(req){

                    if(req=="name"){

                        name = reqObj[req];
                    }
                    else if(req=="email"){
                        email =reqObj[req];
                    }
                    else if(req=="countrycode"){
                        countrycode =reqObj[req];
                    }


                })

                console.log('Name : '+ name );
                console.log('Email : '+ email );
                console.log('Country Code : '+ countrycode );

                if(name.length && email.length){

                    onPushcsrGeneration = function (status) {
                        if(status){
                            console.log("******* Push csr Generated ******* ");
                            var resJson = {
                                "link": "https://idmsa.apple.com/IDMSWebAuth/login?appIdKey=3fbfc9ad8dfedeb78be1d37f6458e72adc3160d1ad5b323a9e5c5eb2f8e7e3e2&rv=2"
                            }
                            res.send(resJson); 
                            res.end(); 

                        }else{
                            console.log("push csr generation failed");
                        }
                    }



                    
                    generatecsr.entrypoint(email,countrycode,onPushcsrGeneration);
                }
                else{

                    if(!name.length){
                        res.send("Name field is Empty"); 
                        
                    }
                    else if (!email.length) {
                        res.send("Email field is Empty"); 
                        
                    }
                    res.end(); 
                }
            
            }
        })

          } else{
          
              console.log('Token: '+tokenID +' Mismatch');
              res.sendStatus(406);
            }
    });

    
});

router.use('/upload-signed-push-csr',applecert);
router.use('/applecertificate/',applecert);




module.exports = router;

