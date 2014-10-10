
var Promise = require('bluebird');


// Returns Promise with then returning array of user's roles
function getUserRoles(user)
{
    var userRoles = [];

    if(typeof user === 'undefined') {

        // User is not logged in, return default (Anonymous)
        userRoles.push( sails.config.appConfig.constants.PERM_ANONYMOUS_LABEL);
        return Promise.resolve(userRoles);

    } else {

        return User.findOne(user[0].id).populate('userroles').then( function(user) { 
            user.userroles.forEach( function(role) {
                userRoles.push(role.name)
            });
            return userRoles;

        });
    }
}

module.exports = {
	
	isAllowed: function(user, opts, cb) {
		
		// opts is an array: [{ group: '...', permission: [..] }, { group: '...', permission: [..] }]
		var promises = []
		opts.forEach( function(opt) {
			opt.permission.forEach( function(perm) {
				promises.push( Permission.findOne( { where: { group: opt.group, permission: perm } }).populate('userroles') );
			});
		});
		
        // Run all promises
        Promise.join( Promise.all(promises), getUserRoles(user), function(permissions, userRoles) {

            // Check if there are undefined permissions
            if( permissions.some( function(perm) { return typeof perm === 'undefined' } ) )
            {
                // Atleast one permission is not defined
                if( sails.config.appConfig.constants.PERM_BLOCK_UNDEFINED ) {
                    cb("A PERM NOT DEFINED", false);
                    return;
                }
            }

            // Now remove undefined permissions
            permissions = permissions.filter(Boolean);
            // Iterate over each permission and match the role allowed with
            // user's roles
            var notAllowed = permissions.some( function(perm) {
                return perm.userroles.some( function(userrole) {
                    // match by text not by id
                    if( userRoles.indexOf(userrole.name) < 0)
                    {
                        // First perm not matched, callback with failure
                        //console.log("NOT FOUND " + userrole.name);
                        return true;    // .some exits on true
                    } else {
                        // Debug
                        //console.log("FOUND " + userrole.name);
                        return false;   // perm ok, check next perm
                    }
                });
            });

            if(notAllowed) {
                cb("NOT ALLOWED", false);
            } else {
                cb(null, true);
            }

            /*
            console.log(notAllowed);
            console.log(permissions);
            console.log(userRoles);
            */

        });
	}

};
