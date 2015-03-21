// Policy to run on all routes/controllerActions
// Extracts Auth token from the req.header and attaches it to req
// Ref:: http://angular-tips.com/blog/2014/05/json-web-tokens-examples/j;w

module.exports = function(req, res, next) {
    var token;

    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0],
            credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
        }
    } else if (req.param('token')) {
        token = req.param('token');
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    } else {
        // No Auth token header with the header
        req.authToken = undefined;
        return next();
        // Dont worry if no Authorization header was found, it could be a Guest user
        //return res.json(401, {err: 'No Authorization header was found'});
    }

    AuthTokenService.verifyAuthToken(token, function(err, token) {
        if (err) return res.json(401, {err: 'The token is not valid'});
        req.authToken = token;
        next();
    });
};
