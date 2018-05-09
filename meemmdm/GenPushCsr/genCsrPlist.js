


var exec = require('child_process').exec;
var util = require('util');
var cmd_set_randfile = "set RANDFILE=.rnd";
var cmd_gen_private_key = "powershell ./OpenSSL/bin/openssl genrsa -out ./GenPushCsr/temp-files/pushcer.key 2048";
var cmd_gen_pus_csr ;
var onFinish;
var curlprogresssupress = "$ProgressPreference = \"SilentlyContinue\"";

//Convert CSR to DER format
var cmd_csr_to_der = "powershell ./OpenSSL/bin/openssl req -inform pem -outform der -in ./GenPushCsr/temp-files/push.csr -out ./GenPushCsr/temp-files/push.der -config ./OpenSSL/bin/openssl.cnf ";
//convert file to base 64 string
var cmd_pushcsr_to_base64 = "powershell ./OpenSSL/bin/openssl base64 -in ./GenPushCsr/temp-files/push.der -out ./GenPushCsr/temp-files/pushbase64.txt";
//extarct siganature
var cmd_signature = "powershell ./OpenSSL/bin/openssl sha1 -sign ./GenPushCsr/private.key -out ./GenPushCsr/temp-files/signed_output.rsa  ./GenPushCsr/temp-files/push.der"
//convert file to base 64 string
var cmd_signature_to_base64 = "powershell ./OpenSSL/bin/openssl base64 -in ./GenPushCsr/temp-files/signed_output.rsa -out ./GenPushCsr/temp-files/signed_output.txt";

//downlaod apple certificate and convert it to pem format    
var cmd_download_apple_wwdrc = "powershell curl -o ./GenPushCsr/appleRootCer/AppleWWDRCA.cer 'https://developer.apple.com/certificationauthority/AppleWWDRCA.cer'"
var cmd_download_apple_root = "powershell curl -o ./GenPushCsr/appleRootCer/AppleIncRootCertificate.cer 'http://www.apple.com/appleca/AppleIncRootCertificate.cer'"

//convert apple certificates
var cmd_apple_wwdrca = "powershell ./OpenSSL/bin/openssl x509 -inform der -in ./GenPushCsr/appleRootCer/AppleWWDRCA.cer -out ./GenPushCsr/appleRootCer/AppleWWDRCA.pem"
var cmd_apple_root = "powershell ./OpenSSL/bin/openssl x509 -inform der -in ./GenPushCsr/appleRootCer/AppleIncRootCertificate.cer -out ./GenPushCsr/appleRootCer/AppleIncRootCertificate.pem"

function genRandFileCB(error, stdout, stderr) {
    if (error) {
        console.log("genRandfile err", error);
    } {
        // execute gen push csr cmd 
        exec(cmd_gen_private_key, genPrivatekeyCB);
    }
}

function genPrivatekeyCB(error, stdout, stderr) {
    if (error) {
        console.log("genPrivatekeyCB err", error);
    } {
        // execute gen push csr cmd 
        exec(cmd_gen_pus_csr, cmd_gen_push_csr_callback);
    }
}

//gen push.csr  callback
function cmd_gen_push_csr_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_gen_push_csr_callback err", error);
    } else {
        exec(cmd_csr_to_der, cmd_csr_to_der_callback);
    }
}
//push.cer tp push.der callback
function cmd_csr_to_der_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_csr_to_der_callback err", error);
    } else {
        exec(cmd_pushcsr_to_base64, cmd_pushcsr_to_base64_callback);
    }
}
//convert push.der to base65 
function cmd_pushcsr_to_base64_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_csr_to_der_callback err", error);
    } else {
        exec(cmd_signature, cmd_signature_callback);
    }
}
function cmd_signature_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_csr_to_der_callback err", error);
    } else {
        //exec(cmd_signature_to_base64, cmd_signature_to_base64_callback);
        exec(cmd_signature_to_base64, cmd_apple_root_callback);
    }
}
function cmd_signature_to_base64_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_csr_to_der_callback err", error);
    } else {
        exec(cmd_download_apple_wwdrc, cmd_download_apple_wwdrc_callback);

    }
}

//downlaod apple certificate and convert it to pem format    
function cmd_download_apple_wwdrc_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_download_apple_wwdrc_callback err", error);
    } else {
        exec(cmd_download_apple_root, cmd_download_apple_root_callback);
    }
}

function cmd_download_apple_root_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_download_apple_root_callback err", error);
    } else {
        exec(cmd_apple_wwdrca, cmd_apple_wwdrca_callback);
    }
}


function cmd_apple_wwdrca_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_apple_wwdrca_callback err", error);
    } else {
        exec(cmd_apple_root, cmd_apple_root_callback);
    }
}
function cmd_apple_root_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_apple_root_callback err", error);
    } else {
        console.log("---- All intermediate files are ready ---- ");
        startPrepaingPushCsr();
    }
}

function startPrepaingPushCsr() {
    console.log('-----   creating push csr plist   --------');

    var plist = require('plist');
    var fs = require('fs');
    var mdmdata = fs.readFileSync('./GenPushCsr/mdm.pem', "utf8");
    var applewwdcrca = fs.readFileSync('./GenPushCsr/appleRootCer/AppleWWDRCA.pem', "utf8");
    var applerootca = fs.readFileSync('./GenPushCsr/appleRootCer/AppleIncRootCertificate.pem', "utf8");
    var pushcsrbase64 = fs.readFileSync('./GenPushCsr/temp-files/pushbase64.txt', "utf8");
    var signrsabase64 = fs.readFileSync('./GenPushCsr/temp-files/signed_output.txt', "utf8");
    var json = {
        "PushCertCertificateChain": mdmdata + applewwdcrca + applerootca,
        "PushCertRequestCSR": pushcsrbase64,
        "PushCertSignature": signrsabase64
    };
    fs.writeFileSync('./GenPushCsr/csr-file-to-upload/applepush.csr', Buffer.from(plist.build(json)).toString('base64'))

    var privatekey_buff = fs.readFileSync('./GenPushCsr/temp-files/pushcer.key');
    fs.writeFileSync('./certs/push/PushCert.key', privatekey_buff);
    console.log('-------------  completed  ----------------');
    onFinish(true);
}   

//callback chian to generate applepush.csr
exports.entrypoint = function (email,countrycode,cb){
    console.log("---------- start preparing files ----------");
    var sub = "/emailAddress=" + email + "/C=" + countrycode ;
    onFinish = cb;
    //create private key 2048 bit 
    cmd_gen_pus_csr  = "powershell ./OpenSSL/bin/openssl req -config ./OpenSSL/bin/openssl.cnf -new -sha256 -key ./GenPushCsr/temp-files/pushcer.key -out ./GenPushCsr/temp-files/push.csr -subj '" + sub + "'";
    console.log(cmd_gen_pus_csr);
    exec(cmd_set_randfile, genRandFileCB);
}


