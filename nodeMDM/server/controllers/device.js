var request = require('request');

module.exports.sendrequest = function(req, res, callback){
    var requestOptions, path;
    path = "http://firmware.meemmemory.com/apple/README.txt";
    requestOptions = {
        url : path,
        method : "GET",
        json : {}
    };
    request(
            requestOptions,
            function(err, response, body) {
                var data = body;
                if (response.statusCode === 200) {
                    console.log('data %s',data);
                } else {
                    console.log('statuscode %d', response.statusCode);
                }
                callback(req, res);
            }
           );
};
