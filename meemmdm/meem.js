var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var winston = require('./logconfig/winston');

var device = require('./server/controllers/device')
var authentication = require('./server/controllers/authentication');
var certificate = require('./server/controllers/certificate');

require('./server/models/dbconfig');

var routesApi = require('./server/routes/index');

var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Use the API routes when path starts with /api
app.use('/meem', routesApi);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({ "message": err.name + ": " + err.message });
    }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



/*** Device MDM ***/

var fs = require('fs');
// const router = require('./device/routes/index');

// //  Connect all our routes to our application

// app.use('/device', router);



/* File Upload*/
var multer = require('multer');
var apnscerPath = "./certs/push/PushCert.pem";
var apnskeyPath = "./certs/push/PushCert.key";

var apnscerUploadPath = "./uploads/PushCert.pem";
var genenrollonfig = require('./GenEnrollConfig/genEnrollConfig');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads")
    },
    filename: function (req, file, callback) {
        callback(null, "PushCert.pem")
    }
})

function copyData(savPath, srcPath,  cb){
    fs.readFile(srcPath, 'utf8', function (err, data) {
            if (err) throw err;
            //Do your processing, MD5, send a satellite to the moon, etc.
            fs.writeFile (savPath, data, function(err) {
                if (err) throw err;
                console.log('complete');
                cb();
            });
        });
}

app.post('/applepemupload', bodyParser.json(), function (req, res) {

    console.log("File upload");

    var tokenID;
    //console.log(tokenID);

    authentication.getTokenID(function(id){
        tokenID = id.authID;
        var upload = multer({
            storage: storage,
            fileFilter: function (req, file, callback) {
                var ext = path.extname(file.originalname)
                callback(null, true)
            }
        }).single('userFile');
        upload(req, res, function (err) {
            res.end('File is uploaded. iOS Enroll link:http://www.codeswallop.com/meem/device/enroll')
    
        copyData(apnscerPath,apnscerUploadPath,function(params) {
    
            console.log("File Copied.");
            authentication.fetchEmailByTokenId(tokenID, function(email){
                console.log('here before addAPNCert')
                certificate.saveAPNCert(email, fs.readFileSync(apnscerPath),fs.readFileSync(apnskeyPath) , function(){
    
    
                    genenrollonfig.entrypoint(tokenID,function(status){
    
                        if(status){
            
                            console.log("******* Enroll Config Generated ******* ");
                            res.end(); 
            
                         }else{
                            console.log("Enroll Config Generation failed");
                            res.end(); 
            
                         }
                    });
    
                });
            });
            
        } )
            })
    })

})
/*Done */

/*Root*/
app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname + '/index.html'));

});
/*End */

//var key = fs.readFileSync('./certs/ssl/Server.key');
//var cert = fs.readFileSync('./certs/ssl/Server.crt');
//var ca = fs.readFileSync('./certs/ssl/CA.crt');
//
//var options = {
//  key: key,
//  cert: cert,
//  ca: ca
//};

var http = require('http');
http.createServer( app).listen(process.env.PORT || 3000);

module.exports = app;
