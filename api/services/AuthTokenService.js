// AuthorizationService
// Handels creating, granting, verfifying, decoding auth tokens
//Ref:: http://angular-tips.com/blog/2014/05/json-web-tokens-examples/
/*
var jwt = require('jsonwebtoken');

module.exports = {
	
	createAuthToken: function(payload) {
        // create a new token
        var token = jwt.sign(payload, sails.config.appConfig.jwtSecret, {});
        return token;
    },

	verifyAuthToken: function(token, opt, cb) {

        return jwt.verify(token, sails.config.appConfig.jwtSecret, opt, cb);
        //var tokenVerify = jwt.verify(token, sails.config.appConfig.jwtSecret, opt, cb(tokenVerified));
        //return tokenVerify;
    },

    decodeAuthToken: function(token, opt) {
        var tokenDecode = jwt.decode(token, opt);
        return tokenDecode;
    },

};
*/
var jwt = require('jsonwebtoken');

module.exports.issueAuthToken = function(payload) {
  var token = jwt.sign(payload, sails.config.appConfig.jwtSecret);
  return token;
};

module.exports.verifyAuthToken = function(token, verified) {
  return jwt.verify(token, sails.config.appConfig.jwtSecret, {}, verified);
};
