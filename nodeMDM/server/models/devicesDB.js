var mongoose = require('mongoose');
var console = require('console');
//var profile = require('profileDB')



// var someSchema = new mongoose.Schema({
//     device : {
//         deviceID:{
//             type:String,
//             unique:true,
//             required:true
//         },
//         authentication: {
//             buildVersion:String,
//             osVersion:String, //accepted value - [apple, android, windows, mac, linux]
//             model:String,
//             IMEI:String,
//             MEID:String,
//             UDID:String,
//             productName:String,
//             serialNumber:String,
//             topic:String
//         },
//         tokenUpdate: {
//             token: Buffer,
//             topic: String,
//             UDID: String,
//             pushMagic: String,
//             unlockToken: String,
//             awaitingConfiguration: Boolean
//         },
//         isEnrolled:Boolean,
//         profilename: {type: mongoose.Schema.ObjectId, ref: 'Profile'}
//     },
//     user : {
//         email:{
//             type:String,
//             unique:true,
//             required:true
//         },
//         name:String
//     }
// });



// someSchema.methods.someSchemaMethod = function(value) {
//     console.log('Inside the schema funcion');
//     try {
//         this.device.authentication.buildVersion = value
//     } catch(e) { console.log('FAIL '+e.message)}
       
// }

// var someModel = mongoose.model('schema', someSchema);

// module.exports.someFunction = function() {
//     var someObject = new someModel();

//     try{
//         someObject.someSchemaMethod('kiri');
//     } catch(e) {
//         console.log('-----------------------------------------------------++++++++++++++++++++++++++++-------------------------')
//         console.log(e.message);
//     }
// };



// var devicesEnrolled = {
// 	deviceID:{
// 		type:String,
// 		unique:true,
// 		required:true
// 	},
// 	authentication: {
//         buildVersion:String,
//         osVersion:String, //accepted value - [apple, android, windows, mac, linux]
//         model:String,
//         IMEI:String,
//         MEID:String,
//         UDID:String,
//         productName:String,
//         serialNumber:String,
//         topic:String
//     },
//     tokenUpdate: {
//         token: Buffer,
//         topic: String,
//         UDID: String,
//         pushMagic: String,
//         unlockToken: String,
//         awaitingConfiguration: Boolean
//     },
//     isEnrolled:Boolean,
//     profilename: {type: mongoose.Schema.ObjectId, ref: 'Profile'}
// };

// var usersEnrolled = {
//     email:{
//         type:String,
//         unique:true,
//         required:true
//     },
//     name:String
// };

var deviceSchema = new mongoose.Schema({

    device : {
        deviceID:{
            type:String,
            unique:true,
            required:true
        },
        authentication: {
            buildVersion:String,
            osVersion:String, //accepted value - [apple, android, windows, mac, linux]
            model:String,
            IMEI:String,
            MEID:String,
            UDID:String,
            productName:String,
            serialNumber:String,
            topic:String
        },
        tokenUpdate: {
            token: Buffer,
            topic: String,
            UDID: String,
            pushMagic: String,
            unlockToken: Buffer,
            awaitingConfiguration: Boolean
        },
        isEnrolled:Boolean,
        profilename: {type: mongoose.Schema.ObjectId, ref: 'Profile'}
    },
    user : {
        email:{
            type:String,
            //unique:true,
            //required:true
        },
        name:String
    }
});

deviceSchema.methods.addAuthenticationDetail = function(authDetails){

    var strings = authDetails["plist"]["dict"]["string"];

    console.log(strings)

    this.device.authentication.buildVersion = strings[0]
    this.device.authentication.IMEI = strings[1]

    this.device.authentication.osType = strings[3] //For the time being
    //this.model = ,
    this.device.authentication.productName = strings[4]
    this.device.authentication.serialNumber = strings[5]
    this.device.authentication.topic = strings[6]
    this.device.authentication.UDID = strings[7]

    this.device.deviceID = strings[1]; //For the time being
}

deviceSchema.methods.addUser = function(userDetail) {

    this.user.email = userDetail.email;
    this.user.name = userDetail.name;
}

deviceSchema.methods.addTokenUpdate = function(tokenUpdate) {

    var strings = tokenUpdate["plist"]["dict"]["string"];
    var data = tokenUpdate["plist"]["dict"]["data"];

    console.log(strings)

    this.device.tokenUpdate.token =data[0];
    this.device.tokenUpdate.topic = strings[2];
    this.device.tokenUpdate.UDID = strings[3];
    this.device.tokenUpdate.pushMagic = strings[1];
    this.device.tokenUpdate.unlockToken = data[1];
    this.device.tokenUpdate.awaitingConfiguration = false;
};

var Device = mongoose.model('Device', deviceSchema);


module.exports.saveAuthenticationDetail = function(authDetails){
    
    var deviceObj = new Device();

    deviceObj.addAuthenticationDetail(authDetails);

    deviceObj.save(function(err){
        if(err) {
            console.log('Error while saving ' + err.message);
        }
        else{
            console.log('Successfully stored')
        }
    });
};

// module.exports.saveUserDetail = function(userDetail){

// }

module.exports.saveTokenUpdate = function(tokenUpdateArg){

    var UDID = tokenUpdateArg["plist"]["dict"]["string"]

    //console.log('Here in saveTokenUpdate ' + tokenUpdateArg["plist"]["dict"]["string"]["UDID"])

    Device.findOne({'device.authentication.UDID' : UDID[3]}, function(err, deviceObj){

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

module.exports.getDeviceList = function() {

    console.log('Inside get devie list!!')
    Device.find({}, function(err, deviceList){

            if(err)
                console.log('Error getting device list')
            else if(deviceList === null){
                console.log('NULL object')
            }else{
                deviceList.forEach(function(list){
                    //console.log(list);
                    console.log( JSON.stringify(list, null, "    ") );
                })
            }
            return deviceList;
    })


}

exports.linkProfileToDevice = function() {

/*To be decided*/ 
}