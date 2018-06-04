var Device = require('../schema/devicesDB')
var authentication = require('../api/authentication')
let User = require('app/model/schema/authDB');

// module.exports.saveKeyEmail = function (email) {
//     var deviceObj = new Device();

//     deviceObj.addKeyEmail(email);

//     deviceObj.save(function (err) {
//         if (err) {
//             console.log('Error while saving ' + err.message);
//         }
//         else {
//             console.log('Successfully stored')
//         }
//     });
// }

// module.exports.saveUserDetail = function (email, usrDeatil) {
//     Device.findOne({ 'adminKeyEmail': email }, function (err, deviceObj) {
//         deviceObj.addUserDetail(usrDeatil);

//         deviceObj.save(function (err) {
//             if (err)
//                 console.log('Error while saving');
//             else {
//                 console.log('SUCCESSFULY stored')
//             }
//         });
//     })
// }

module.exports.saveAuthenticationDetail = function (hash, authDetails, cb) {

    authentication.fetchIdByHash(hash, function (Id) {

        var device = new Device({
            "deviceId": authDetails["UDID"],
            "admin": Id,
            "authentication": authDetails
        });

        device.save(function (err) {
            if (err)
                console.log('Error while saving ' + err);
            else {
                console.log('SUCCESSFULY stored')
            }
        });

        User.findById(Id, function (err, user) {
            user.deviceArray.push(device);

            user.save(function (err) {
                if (err)
                    console.log('Error while saving ' + err);
                else {
                    console.log('SUCCESSFULY stored')
                    cb();
                }
            });
        })
    })
};

module.exports.saveTokenUpdate = function (hash, tokenUpdateArg, cb) {
    authentication.fetchIdByHash(hash, function (Id) {


        console.log('**' + JSON.stringify(tokenUpdateArg))

        Device.findOne({ 'deviceId': tokenUpdateArg['UDID'] }, function (err, deviceObj) {

            deviceObj.tokenUpdate = tokenUpdateArg;
            deviceObj.save(function (err) {
                if (err)
                    console.log('Error while saving');
                else {
                    console.log('Token UPDATE SUCCESSFULY stored')
                    cb();
                }
            });
        })
    })
};

module.exports.listdevices = function (tokenId, cb) {

    var deviceArray = [];

    authentication.fetchIdByTokenId(tokenId, function(Id){

        console.log(Id)
        Device.find({'admin':Id}, function (err, deviceList) {

            console.log(JSON.stringify(deviceList))
            if (err)
                console.log('Error getting device list')
            else if (!deviceList) {
                console.log('NULL object')
            } else {
    
                deviceList.forEach(function (list) {
    
                    var json = {
                        "devices": {
                            "deviceid": list.deviceId,
                            "Device": {
                                "name": 'Some_dummy_name',
                                "OSversion": list.authentication.OSVersion,
                                "platform": 'IOS',
                                "buildversion": list.authentication.BuildVersion,
                                "model": list.authentication.ProductName,
                                "modelname": list.authentication.ProductName,
                                "productname": list.authentication.ProductName,
                                "udid": list.authentication.UDID,
                                "imei": list.authentication.IMEI,
                                "serialnumber": list.authentication.SerialNumber,
                                "devicecapacity": '12GB',
                                "freespace": '2GB',
                                "batterylevel": '17'
                            },
                            "Network": {
                                "bluetoothMAC": 'AB:CD:EF:AB:CD:EF',
                                "WiFiMAC": 'AB:CD:EF:AB:CD:EF',
                                "IPaddress": '192.168.0.8',
                                "WifiSSD": 'ABCDEF'
                            }
                        }
                    };
    
                    //console.log(JSON.stringify(json))
    
                    deviceArray.push(json)
                })
            }
    
            cb(deviceArray);
        })
    })
    
}

exports.linkProfileToDevice = function () {

    /*To be decided*/
}

module.exports.getTokenByDevId = function (tokenId, devId, tokenCB) {

    // Device.find({'adminKeyEmail': email, 'deviceList.device.deviceID': devId}, 'deviceList.device.tokenUpdate.Token deviceList.device.tokenUpdate.PushMagic', function (err, token) {
    Device.findOne({ 'deviceId': devId }, function (err, token) {

        if (err) {
            console.log('Error while fetcing token')
        }
        if (token) {

            console.log("Device Token: " + JSON.stringify(token));

            //  console.log('*** '+token[0].deviceList[0].device.tokenUpdate.token+'   '+token[0].deviceList[0].device.tokenUpdate.pushMagic);
            tokenCB(token.tokenUpdate.Token, token.tokenUpdate.PushMagic);
        }
    });
}

module.exports.deregisterAdmin = function (email) {
    Device.deleteOne({ 'adminKeyEmail': email }, function (err) {
        if (err) {
            console.log('Error in droping the device details of ' + email)
        } else
            console.log('Droping device detail success for ' + email)
    })
}
