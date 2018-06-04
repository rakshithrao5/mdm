
var NotifyAPNS = require('./commands/notify');
var DeviceLock = require('./commands/devicelock')
var DeviceInfo = require('./commands/deviceinfo')
var InstallApp = require('./commands/installapp')
var RemoveApp = require('./commands/removeapp')

var MDM = require('../mdmqueue');
require('rootpath')();



/** This function Handles Commands send by Admin to Remotely Managed Device and queued.
 * This commands are send as response to idle status from device as the device wakes up.
*/

exports.ManageCommands = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('Manage Device Commands');


    var tokenID = req.body.tokenID;
    var mycommand = req.body.command;


    if (mycommand == "deviceinfo") {
        var deviceinfo = new DeviceInfo(req, res);
        deviceinfo.push();

    } else if (mycommand == "devicelock") {
        var devicelock = new DeviceLock(req, res);
        devicelock.push();

    } else if (mycommand == "installmyapplication") {
        var installapp = new InstallApp(req, res);
        installapp.push();

    } else if (mycommand == "removeapplication") {
        var removeapp = new RemoveApp(req, res);
        removeapp.push();
    }

    NotifyAPNS.notify(req,res);
    res.end();
};
