var Device  = require('../models/devicesDB')

module.exports.saveKeyEmail = function(email){
    var deviceObj = new Device();

    deviceObj.addKeyEmail(email);

    deviceObj.save(function(err){
        if(err) {
            console.log('Error while saving ' + err.message);
        }
        else{
            console.log('Successfully stored')
        }
    });
}

module.exports.saveUserDetail = function(email, usrDeatil){
    Device.findOne({'adminKeyEmail' : email}, function(err, deviceObj){
        deviceObj.addUserDetail(usrDeatil);

        deviceObj.save(function(err){
            if(err)
                console.log('Error while saving');
                else{
                    console.log('SUCCESSFULY stored')
                }
        });
    })
}

module.exports.saveAuthenticationDetail = function(email, authDetails){
  
     //var deviceObj = new Device();

    //  deviceObj.addAuthenticationDetail(authDetails);

    //  deviceObj.save(function(err){
    //      if(err) {
    //          console.log('Error while saving ' + err.message);
    //      }
    //      else{
    //          console.log('Successfully stored')
    //      }
    //  });

     Device.findOne({'adminKeyEmail' : email}, function(err, deviceObj){

        if(err){
            console.log('The error while fetching ' + err)
        }
        deviceObj.addAuthenticationDetail(authDetails);

        deviceObj.save(function(err){
            if(err)
                console.log('Error while saving');
                else{
                    console.log('SUCCESSFULY stored')
                }
        });
    })
 };

//  module.exports.saveUserDetail = function(userDetail){

    
//  }

 module.exports.saveTokenUpdate = function(email, tokenUpdateArg){

     var UDID = tokenUpdateArg["plist"]["dict"]["string"]

     //console.log('Here in saveTokenUpdate ' + tokenUpdateArg["plist"]["dict"]["string"]["UDID"])

     Device.findOne({'adminKeyEmail' : email}, function(err, deviceObj){

         if(err){
             console.log('The error while fetching ' + err)
         }
         deviceObj.addTokenUpdate(tokenUpdateArg);

         deviceObj.save(function(err){
             if(err)
                 console.log('Error while saving');
                 else{
                     console.log('SUCCESSFULY stored')
                 }
         });
     })

 };

 module.exports.listdevices = function(cb) {

     var deviceArray = [];

     //console.log('111')
     Device.find({}, function(err, deviceList){

             if(err)
                 console.log('Error getting device list')
             else if(deviceList === null){
                 console.log('NULL object')
             }else{

                 deviceList.forEach(function(list){
                    
                    var json = {  
                        "devices" : {
                            "deviceid" : list.device.authentication.IMEI,
                            "Device": {
                                "name" :  'Some_dummy_name' ,
                                "OSversion" :  list.device.authentication.osVersion,
                                "platform" :     'IOS'     ,
                                "buildversion" :   list.device.authentication.buildVersion,
                                "model" :  list.device.authentication.productName,
                                "modelname" : list.device.authentication.productName,
                                "productname" :  list.device.authentication.productName,
                                "udid" :  list.device.authentication.UDID,
                                "imei" :  list.device.authentication.IMEI,
                                "serialnumber" : list.device.authentication.serialNumber,
                                "devicecapacity" :  '12GB' ,
                                "freespace" :   '2GB'   ,
                                "batterylevel" :     '17'      
                            },
                            "Network" : {
                                 "bluetoothMAC" :     'AB:CD:EF:AB:CD:EF',
                                "WiFiMAC" :     'AB:CD:EF:AB:CD:EF',
                                "IPaddress" : '192.168.0.8',
                                "WifiSSD" :  'ABCDEF'   
                            }
                        }
                    };

                    deviceArray.push(json)
                 })
             }

            cb(deviceArray);
     })
}

 exports.linkProfileToDevice = function() {

 /*To be decided*/ 
 }


