var mongoose = require('mongoose');
var console = require('console');

var deviceSchema = new mongoose.Schema({

    adminKeyEmail:{
		type:String,
		unique:true,
		required:true
	},
    device : {
        deviceID:{
            type:String,
            //unique:true,
            //required:true
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
        name:String,
        email:{
            type:String,
            //unique:true,
            //required:true
        },
        countrycode: String
    }
});

deviceSchema.methods.addKeyEmail = function(email){
    this.adminKeyEmail = email;
}

deviceSchema.methods.addUserDetail = function(userDetail){
    this.user = userDetail;
}


deviceSchema.methods.addAuthenticationDetail = function(authDetails){

    var strings = authDetails["plist"]["dict"]["string"];

    console.log(strings)

    this.device.authentication.buildVersion = strings[0]
    this.device.authentication.IMEI = strings[1]

    this.device.authentication.osVersion = strings[3] //For the time being
    //this.model = ,
    this.device.authentication.productName = strings[4]
    this.device.authentication.serialNumber = strings[5]
    this.device.authentication.topic = strings[6]
    this.device.authentication.UDID = strings[7]

    this.device.deviceID = strings[1]; //For the time being
}

// deviceSchema.methods.addUser = function(userDetail) {

//     this.user.email = userDetail.email;
//     this.user.name = userDetail.name;
// }

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

module.exports = Device;