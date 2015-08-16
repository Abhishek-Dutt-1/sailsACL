var clientId     = sails.config.imgur.clientId;
var clientSecret = sails.config.imgur.clientSecret;
var response_type = 'code';
var application_state = '';


module.exports = {

    getOauthUrl: function() {
        return 'https://api.imgur.com/oauth2/authorize?client_id=' + clientId + '&response_type=' + response_type + '&state=' + application_state;
    },

    // Async
    checkIfAuthorized: function(callback) {

        Imgur.find().limit(1).exec(function(err, data) {
            if (err) return callback(err);
            if (data.length > 0) {
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        });
    }

}
