var MDM = require('../mdmqueue');

/** This function Handles the mdm server requests from Remotely Managed Device*/

exports.ProcessDeviceServerCommands = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('****server Data*******');

    var string = JSON.stringify(req.body);
    var myObj = JSON.parse(string);

    var cmdrespMap = new Map();
    var i = 0;

    myObj.plist.dict.key.forEach(function (item) {
        cmdrespMap.set(item, myObj.plist.dict.string[i]);
        i++;
    })

    var firstKey = cmdrespMap.keys().next().value;
    switch (firstKey) {
        case 'Status': {
            console.log("status ", cmdrespMap.get('Status'));
            if (0 == MDM.Queue.length) {
                //res.sendStatus(200);
                res.end();
            } else {
                sendCommandPlist(req, res);
            }
        }
            break;
        case 'CommandUUID': {
            console.log(" command UDID ", cmdrespMap.get('CommandUUID'));
            console.log("command sataus ", cmdrespMap.get('Status'));
            //res.sendStatus(200);
            if (0 == MDM.Queue.length) {
                res.end();
            }
            else {
                res.sendStatus(200);
            }
        }
            break;
        default: {
            console.log("Default Case");
            if (0 == MDM.Queue.length) {
                res.end();
            }
            else {
                res.sendStatus(200);
            }
        }
            break;
    }

};

function sendCommandPlist(req, res) {

    if (0 != MDM.Queue.length) {
        var commandData = MDM.Queue.shift();
        console.log("commandData: "+commandData);
        res.write(commandData);
        res.end();
    }

}


