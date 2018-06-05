var mongoose = require('mongoose');
var console = require('console');

var deviceSchema = new mongoose.Schema({
    // user :{
    //     type: mongoose.Schema.Types.Mixed,
    //     default: null
	// },
	deviceId:{
        type:String,
        unique:true,
        required:true
    },
    authentication:{ 
        type: mongoose.Schema.Types.Mixed
    },
    tokenUpdate:{
       type: mongoose.Schema.Types.Mixed
    },
    isEnrolled:{
        type: Boolean,
        default: true
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    },
    profie:{
         type: mongoose.Schema.Types.ObjectId, ref:'profile'
    }
});

var Device = mongoose.model('device', deviceSchema);
module.exports = Device;


