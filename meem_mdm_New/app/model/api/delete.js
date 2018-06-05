authentication = require('./authentication');
certificate = require('./certificate');
device = require('./device');
profile = require('./profile');
module.exports.deRegisterAdmin = function (req, res) {

    authentication.fetchEmailByTokenId(req.body.tokenID, function (email) {
        console.log("email", email);
        authentication.deregisterAdmin(email)
        certificate.deregisterAdmin(email);
        device.deregisterAdmin(email);
        profile.deregisterAdmin(email);
    });

    authentication.fetchHashByTokenId(req.body.tokenID, function (hash) {
        var utility = require("utils/utility.js");
        utility.delete_adminDir(hash, function () {
            console.log("Accouts/"+hash+" deleted");
            res.status(200);
            res.json(
                {
                    "message": "De Registration success"
                }
            );
        });
    });



}