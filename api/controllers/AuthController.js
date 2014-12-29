/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');

module.exports = {
    
    login: function(req, res) {
		// check if current user can login
		PermissionService.isAllowed(req.user, [ { group: 'auth', permission: ['can register'] } ] , function(err, success) {
			if(err) {
				console.log("ERROR " + err);
				console.log(err);
				res.send(err);
			}
			if(success) {
				console.log("SUCCESS " + success);
				console.log(success);
				res.view();
			}
		});
        
    },
    process: function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if( (err)||(!user) ) {
                return res.send(401, {
                    message: 'login failed'
                });
                res.send(err);
            }
            req.logIn(user, function(err) {
                if(err) res.send(err);
                return res.send({
                    message: 'login successful',
			user: user
                });
            });
        }) (req, res);
    },

    logout: function(req, res) {
        req.logOut();
        res.send('logout successful');
    }
};

module.exports.blueprints = {
    actions: true,
    rest: true,
    shortcuts: true
};
