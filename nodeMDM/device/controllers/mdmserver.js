var express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.text({type: 'text/html' }))

// parse application/json
router.use(bodyParser.json())
router.use(bodyParser.text({type:"*/*"}));


require('body-parser-xml')(bodyParser);

var path = require('path');
var multer = require('multer')

var app = express();
var fs = require('fs');
var plist = require('plist');

var apn = require('apn');
var converter = require('atob');

const uuid = require('uuid/v1');

var plistQueue = [];

var emailaccname = "";
var emailaddr = "";

var allowcamera = false; 
var allowdocsharing = false; 


router.get('/command-list', function(req, res) {
  res.sendFile(path.join(__dirname + '/../static/sendcommand.html'));
});

router.get('/profile-list', function(req, res) {
  res.sendFile(path.join(__dirname + '/../static/setprofile.html'));
});


function sendCommandPlist(req, res) {
	
	var command = plistQueue.shift();

	console.log("cmd to be sent :", command);								

	if(command == "deviceinfo"){
		var dict = {"RequestType":"DeviceInformation","Queries":["AvailableDeviceCapacity","BluetoothMAC","BuildVersion","CarrierSettingsVersion","CurrentCarrierNetwork","CurrentMCC","CurrentMNC","DataRoamingEnabled","DeviceCapacity","DeviceName","ICCID","IMEI","IsRoaming","Model","ModelName","ModemFirmwareVersion","OSVersion","PhoneNumber","Product","ProductName","SIMCarrierNetwork","SIMMCC","SIMMNC","SerialNumber","UDID","WiFiMAC","UDID"]};
		createMDMCommand(req,res,dict);
	} else if(command == "devicelock"){
		var dict = {"RequestType": "DeviceLock"};
		createMDMCommand(req,res,dict);

	} else if(command == "erasedevice"){
	} else if(command == "clearpasscode"){
		var myObj = plist.parse(fs.readFileSync('./plists/checkin/TokenUpdate.plist', 'utf8'));
		var data = myObj["plist"]["dict"]["data"];
		let unlockToken = data[1];
		let hexUnlockToken = Buffer.from(unlockToken, 'base64').toString('hex');
		var dict = {"RequestType": "ClearPasscode","UnlockToken":unlockToken};
		//var dict = {"RequestType": "ClearPasscode"};
		createMDMCommand(req,res,dict);
	} else if(command == "certificatelist"){
		
		var dict = {"RequestType": "CertificateList"};
		createMDMCommand(req,res,dict);
		
	} else if(command == "provisioningprofilelist"){
			
		var dict = {"RequestType": "ProvisioningProfileList"};
		createMDMCommand(req,res,dict);
	
	} else if(command == "installedapplicationlist"){
		
		var dict = {"RequestType": "InstalledApplicationList"};
		createMDMCommand(req,res,dict);
	
	} else if(command == "managedapplicationlist"){
		
		var dict = {"RequestType": "ManagedApplicationList"};
		createMDMCommand(req,res,dict);
	
	} else if(command == "profilelist"){
			
		var dict = {"RequestType": "ProfileList"};
		createMDMCommand(req,res,dict);
	
	} else if(command == "restrictions"){
		
		var dict = {"RequestType": "Restrictions"};
		createMDMCommand(req,res,dict);
	
	} else if(command == "securityinfo"){
		
		var dict = {"RequestType": "SecurityInfo","Queries":["HardwareEncryptionCaps","PasscodePresent","PasscodeCompliant","PasscodeCompliantWithProfiles"]};
		createMDMCommand(req,res,dict);
	
	} else if(command == "installmyapplication"){
		
		//var dict = {"ChangeManagementState":"Managed","ManagementFlags" : 1,"options":{"PurchaseMethod":1},"RequestType": "InstallApplication","iTunesStoreID":1040757085};
		var dict = {"ChangeManagementState":"Managed","ManagementFlags" : 1,"options":{"PurchaseMethod":1},"RequestType": "InstallApplication","ManifestURL":"https://192.168.0.9:8080/managedapp/manifest.plist"};

		createMDMCommand(req,res,dict);
	
	} else if(command == "removeapplication"){
		
		var dict = {"RequestType":"RemoveApplication","Identifier":"com.meemgdpr.mdm"};
		createMDMCommand(req,res,dict);

	}
	else if(command == "addmanagedemail"){

		//var plistfile = fs.readFileSync('./plists/mdmprofiles/Email.plist');
		
		var emailJson = {"PayloadContent":[{"EmailAccountDescription":"MDM MAIL ACC","EmailAccountName":emailaccname,"EmailAccountType":"EmailTypeIMAP","EmailAddress":emailaddr,"IncomingMailServerAuthentication":"EmailAuthNone","IncomingMailServerHostName":"imap.gmail.com","IncomingMailServerPortNumber":993,"IncomingMailServerUseSSL":true,"IncomingMailServerUsername":emailaddr,"OutgoingMailServerAuthentication":"EmailAuthNone","OutgoingMailServerHostName":"smtp.gmail.com  ","OutgoingMailServerPortNumber":465,"OutgoingMailServerUseSSL":true,"OutgoingMailServerUsername":emailaddr,"OutgoingPasswordSameAsIncomingPassword":true,"PayloadDescription":"Configures Email settings","PayloadDisplayName":"MEEM MAIL ACC","PayloadIdentifier":"com.apple.mail.managed.7181B285-8377-48DF-AD50-E2C59479050A","PayloadType":"com.apple.mail.managed","PayloadUUID":"7181B285-8377-48DF-AD50-E2C59479050A","PayloadVersion":1,"PreventMove":true,"SMIMEEnablePerMessageSwitch":false,"SMIMEEnabled":false,"SMIMEEncryptionEnabled":false,"SMIMESigningEnabled":false,"allowMailDrop":false,"disableMailRecentsSyncing":true}],"PayloadDisplayName":"EmailProfile","PayloadIdentifier":"com.apple.applicationaccess.example","PayloadOrganization":"Meem pvt ltd","PayloadRemovalDisallowed":false,"PayloadType":"Configuration","PayloadUUID":"D6B2474D-A8AF-4668-AA74-358C7250B2FF","PayloadVersion":1}
		var plistfile = plist.build(emailJson);

    // convert binary data to base64 encoded string
    	var profilebase64data = new Buffer(plistfile).toString('ascii');

		createMDMProfile(req,res,profilebase64data);
	}
	else if(command == "addrestriction"){

		//var plistfile = fs.readFileSync('./plists/mdmprofiles/Restriction.plist');

		var restrictionsJson = {"PayloadContent":[{"PayloadDescription":"Configures restrictions","PayloadDisplayName":"Restrictions","PayloadIdentifier":"com.apple.applicationaccess.0BCCB6B5-3C5D-4F45-A5F0-0997C56570A6","PayloadType":"com.apple.applicationaccess","PayloadUUID":"0BCCB6B5-3C5D-4F45-A5F0-0997C56570A6","PayloadVersion":1,"allowActivityContinuation":true,"allowAddingGameCenterFriends":true,"allowAirDrop":true,"allowAirPlayIncomingRequests":true,"allowAirPrint":true,"allowAirPrintCredentialsStorage":true,"allowAirPrintiBeaconDiscovery":true,"allowAppCellularDataModification":true,"allowAppInstallation":true,"allowAppRemoval":true,"allowAssistant":true,"allowAssistantWhileLocked":true,"allowAutoCorrection":true,"allowAutomaticAppDownloads":true,"allowBluetoothModification":true,"allowBookstore":true,"allowBookstoreErotica":true,"allowCamera":allowcamera?true:false,"allowCellularPlanModification":true,"allowChat":true,"allowCloudBackup":true,"allowCloudDocumentSync":true,"allowCloudPhotoLibrary":true,"allowDefinitionLookup":true,"allowDeviceNameModification":true,"allowDictation":true,"allowEnablingRestrictions":true,"allowEnterpriseAppTrust":true,"allowEnterpriseBookBackup":true,"allowEnterpriseBookMetadataSync":true,"allowEraseContentAndSettings":true,"allowExplicitContent":true,"allowFingerprintForUnlock":true,"allowFingerprintModification":true,"allowGameCenter":true,"allowGlobalBackgroundFetchWhenRoaming":true,"allowInAppPurchases":true,"allowKeyboardShortcuts":true,"allowManagedAppsCloudSync":true,"allowMultiplayerGaming":true,"allowMusicService":true,"allowNews":true,"allowNotificationsModification":true,"allowOpenFromManagedToUnmanaged":allowdocsharing?true:false,"allowOpenFromUnmanagedToManaged":allowdocsharing?true:false,"allowPairedWatch":true,"allowPassbookWhileLocked":true,"allowPasscodeModification":true,"allowPhotoStream":true,"allowPredictiveKeyboard":true,"allowProximitySetupToNewDevice":true,"allowRadioService":true,"allowRemoteAppPairing":true,"allowRemoteScreenObservation":true,"allowSafari":true,"allowScreenShot":true,"allowSharedStream":true,"allowSpellCheck":true,"allowSpotlightInternetResults":true,"allowSystemAppRemoval":true,"allowUIAppInstallation":true,"allowUIConfigurationProfileInstallation":true,"allowUntrustedTLSPrompt":true,"allowVPNCreation":true,"allowVideoConferencing":true,"allowVoiceDialing":true,"allowWallpaperModification":true,"allowiTunes":true,"forceAirDropUnmanaged":false,"forceAirPrintTrustedTLSRequirement":false,"forceAssistantProfanityFilter":false,"forceAuthenticationBeforeAutoFill":true,"forceClassroomAutomaticallyJoinClasses":false,"forceClassroomUnpromptedAppAndDeviceLock":false,"forceClassroomUnpromptedScreenObservation":false,"forceEncryptedBackup":false,"forceITunesStorePasswordEntry":false,"forceWatchWristDetection":false,"forceWiFiWhitelisting":false,"ratingApps":1000,"ratingMovies":1000,"ratingRegion":"us","ratingTVShows":1000,"safariAcceptCookies":2,"safariAllowAutoFill":true,"safariAllowJavaScript":true,"safariAllowPopups":true,"safariForceFraudWarning":false,"whitelistedAppBundleIDs":["com.meem.cable"]}],"PayloadDisplayName":"Untitled","PayloadIdentifier":"com.apple.applicationaccess.restrctions","PayloadRemovalDisallowed":false,"PayloadType":"Configuration","PayloadUUID":"3805730B-8D44-4317-B4B9-0C17411A057C","PayloadVersion":1}
		var plistfile = plist.build(restrictionsJson);

		// convert binary data to base64 encoded string
		var profilebase64data = new Buffer(plistfile).toString('ascii');
		createMDMProfile(req,res,profilebase64data);

	}

}

function createMDMCommand(req,res,dict){

    var json = {
					"Command": dict,
					"CommandUUID": uuid()
				};
	var data = plist.build(json);
	console.log("******Sent Cmd*********");
	console.log("Sent Cmd: "+JSON.stringify(json));

	res.write(data);
	res.end();

}

function createMDMProfile(req,res,profilebase64data){


	// var plistfile = fs.readFileSync('./plists/mdmprofiles/testEmail.plist');
    // // convert binary data to base64 encoded string
   //  var profilebase64data = new Buffer(plistfile).toString('ascii');
	var dict = {"RequestType": "InstallProfile","Payload": base64ToBuffer(profilebase64data)};
	var json = {
		"Command": dict,
		"CommandUUID": uuid()
	};
	var data = plist.build(json);
	console.log("******Sent Cmd*********");
	console.log("Sent Cmd String: "+JSON.stringify(json));
	console.log("Sent Cmd: "+data);

	res.write(data);
	res.end();

}



function notifyAPNs(req,res){

    var myObj = plist.parse(fs.readFileSync('./plists/checkin/TokenUpdate.plist', 'utf8'));
    var data = myObj["plist"]["dict"]["data"];
    var string = myObj["plist"]["dict"]["string"];
    let pushMagic = string[1];
	let deviceToken = data[0];
	
	console.log("Push Magic: "+ pushMagic);
	console.log("Device Token: "+ deviceToken);
	let hexDeviceToken = Buffer.from(deviceToken, 'base64').toString('hex');
	
	console.log("Device Token Hex: " + hexDeviceToken);

	var note = new apn.Notification();
	let apnProvider = new apn.Provider({
                key : "./certs/push/PushCert.pem",
                cert : "./certs/push/PushCert.pem",
		production: true
        });

	note.payload = {'mdm': pushMagic};
	apnProvider.send(note,hexDeviceToken).then( (result) => {
		console.log("sent:", result.sent.length);
      		console.log("failed:", result.failed.length);
      		console.log(result.failed);		
	});
	res.end();

}

function base64ToBuffer(base64) {

	'use strict';
    var binstr = base64;
    var buf = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
}


/* Server */
function processMDMCommand  (req,res) {

    if (!req.body) return res.sendStatus(400)
	console.log('****server Data*******');
	var string = JSON.stringify(req.body);
	console.log('Data:'+ string);
	var myObj = JSON.parse(string);

	myObj.plist.dict.key.forEach(function(item){
	 // 	console.log('objects :' + item);
	})
	var cmdrespMap = new Map();
	var i = 0;
	myObj.plist.dict.key.forEach(function(item){
    	//	console.log('objects :' + item);
    		cmdrespMap.set(item,myObj.plist.dict.string[i]);
    		i++;
 	})

	  var firstKey = cmdrespMap.keys().next().value;
	  switch (firstKey) {
		  case 'Status':{
				  console.log("status ", cmdrespMap.get('Status'));
				  if(0 == plistQueue.length){
					//res.sendStatus(200);
					res.end();
				  }else{
					sendCommandPlist(req,res);
				  }
				}
			  break;
		case 'CommandUUID':{
					console.log(" command UDID ", cmdrespMap.get('CommandUUID'));
					console.log("command sataus " , cmdrespMap.get('Status'));
					//res.sendStatus(200);
					if(0 == plistQueue.length){
						res.end();
					}
					else{
						res.sendStatus(200);
					}
				}
		  			break;
		  default:{
		  			console.log("Default Case");
					if(0 == plistQueue.length){
						res.end();
					}
					else{
						res.sendStatus(200);
					}
		  }
		  			break;
			  break;
	  }
}
function sendMDMCommand (req,res) {
	
	if (!req.body) return res.sendStatus(400)
	var mycommand = req.body.command;
	console.log("Adding Command " + mycommand + " to queue..");
	plistQueue.push(mycommand);
	notifyAPNs(req,res);	
}

function setMDMprofile (req,res) {
	
	if (!req.body) return res.sendStatus(400)
	var mycommand = req.body.profile;

	if(mycommand == "addmanagedemail"){

		emailaccname = req.body.username;
		emailaddr = req.body.email;

		if(emailaccname.length && emailaddr.length){

			console.log("Adding Set Profile " + mycommand + " to  queue..");
			console.log("Name " + emailaccname);
			console.log("Email " +emailaddr);
			plistQueue.push(mycommand);
			notifyAPNs(req,res);
		}
		else{
			console.log("Required Fields Empty");
			res.end("Fileds Empty");

		}

	}
	else if (mycommand == "addrestriction") {
		
	
			console.log("Adding Set Profile " + mycommand + " to  queue..");

		
			if(req.body.camera == "yes"){
				console.log("Camera Enabled");
				allowcamera = true; 
			}
			else{
				allowcamera = false; 

			}
			if(req.body.docsharing == "yes"){
				console.log("DocSharing Enabled");
				allowdocsharing = true; 
			}
			else{
				allowdocsharing = false; 

			}
			plistQueue.push(mycommand);
			notifyAPNs(req,res);

	}
	

	
}

router.post('/send-cmd',bodyParser.text({type: 'text/html' }),sendMDMCommand);
router.post('/set-profile',bodyParser.text({type: 'text/html' }),setMDMprofile);

router.put('/',bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB 
    xmlParseOptions: {
      normalize: true,     // Trim whitespace inside text nodes 
      normalizeTags: true, // Transform tags to lowercase 
      explicitArray: false // Only put nodes in array if >1 
    }
}),processMDMCommand);



/*
router.post('/details',bodyParser.urlencoded({ extended: false }),function name(req,res) {
	if (!req.body) return res.sendStatus(400)
	console.log('User Name:'+req.body.username);
	console.log('Email:'+req.body.email);
	res.send("Submitted");
});
router.post('/registeruser',bodyParser.urlencoded({ extended: false }),function name(req,res) {
	if (!req.body) return res.sendStatus(400)
  	res.send('Registered, ' + req.body.username)
});



var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})

router.post('/file-upload', function(req, res) {
	var upload = multer({
		storage: storage,
		fileFilter: function(req, file, callback) {
			var ext = path.extname(file.originalname)
			if (ext !== '.certSigningRequest' && ext !== '.csr' && ext !== '.CSR') {
				return callback(res.end('Only CSR files are allowed'), null)
			}
			callback(null, true)
		}
	}).single('userFile');
	upload(req, res, function(err) {
		res.end('File is uploaded')
	})
})
*/

module.exports = router;
