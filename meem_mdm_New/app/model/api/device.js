var Device = require('../schema/devicesDB')
var authentication = require('../api/authentication')

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
                cb();
            }
        });
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

module.exports.listdevices = function (cb) {

    var deviceArray = [];

    //console.log('111')
    Device.find({}, 'deviceList', function (err, deviceList) {

        //console.log(JSON.stringify(deviceList[0].deviceList))
        if (err)
            console.log('Error getting device list')
        else if (deviceList[0].deviceList === null) {
            console.log('NULL object')
        } else {

            deviceList[0].deviceList.forEach(function (list) {

                var json = {
                    "devices": {
                        "deviceid": list.device.deviceID,
                        "Device": {
                            "name": 'Some_dummy_name',
                            "OSversion": list.device.authentication.osVersion,
                            "platform": 'IOS',
                            "buildversion": list.device.authentication.buildVersion,
                            "model": list.device.authentication.productName,
                            "modelname": list.device.authentication.productName,
                            "productname": list.device.authentication.productName,
                            "udid": list.device.authentication.UDID,
                            "imei": list.device.authentication.IMEI,
                            "serialnumber": list.device.authentication.serialNumber,
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
}

exports.linkProfileToDevice = function () {

    /*To be decided*/
}

module.exports.getTokenByDevId = function (tokenId, devId, tokenCB) {

    // Device.find({'adminKeyEmail': email, 'deviceList.device.deviceID': devId}, 'deviceList.device.tokenUpdate.Token deviceList.device.tokenUpdate.PushMagic', function (err, token) {
    Device.find({ 'deviceId': devId}, 'tokenUpdate.Token tokenUpdate.PushMagic', function (err, token) {

        if (err) {
            console.log('Error while fetcing token')
        }
        if (token) {

            console.log("Device Token: " + JSON.stringify(token));

            //  console.log('*** '+token[0].deviceList[0].device.tokenUpdate.token+'   '+token[0].deviceList[0].device.tokenUpdate.pushMagic);
            //tokenCB(token[0].deviceList[0].device.tokenUpdate.Token, token[0].deviceList[0].device.tokenUpdate.PushMagic);
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
