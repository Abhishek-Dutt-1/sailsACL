var Promise = require('bluebird');

module.exports = {
/*
	isAllowed: function(user, opts, cb) {
		// opts is an array: [{ group: '...', permission: [..] }, { group: '...', permission: [..] }]
		opts.forEach( function(opt) {
			isAllowedGroup(user, opt, cb);
		});
	},
	
	// accepts single opt object
	isAllowedGroup: function(user, opt, cb) {
		// permission within the opt object is an array e.g. permission: ['can edit', 'can view']
		opt.permission.forEach( function(perm) {
			isAllowedPerm(user, opt.group, perm, cb);
		});
	},
	
	isAllowedPerm: function(user, group, perm, cb) {

		Permission.find( { where: { group: opt.group, permission: perm } }).exec( function(err, permission) {
			cb(null, permission);
		});
	
	}
*/
	
	isAllowed: function(user, opts, cb) {
		
		// opts is an array: [{ group: '...', permission: [..] }, { group: '...', permission: [..] }]
		var promises = []
		opts.forEach( function(opt) {
			opt.permission.forEach( function(perm) {
				promises.push( Permission.findOne( { where: { group: opt.group, permission: perm } }).populate('userroles') );
			});
		});
		
		var hasPermissions = true;
		var i = 0;
		var userRoles = [];
		
		if(typeof user === 'undefined') {
			userRoles.push('AnonymousTEMP');
		} else {
			User.findOne(user[0].id).populate('userroles').then( function(user) { 
				user.userroles.forEach( function(role) {
					userRoles.push(role.name)
				});
				
				console.log(userRoles);
				return userRoles
			}).then( function(userRoles) {
		
				Promise.all(promises).then(function(perms) {
				console.log("THEN");
				console.log(perms);
				
				// If the permission is not defined then
				// false will Block, true will be let it pass
				hasPermissions = false;
				for(i = 0; i < perms.length; i++) {
					for(j = 0; j < perms[i].userroles.length; j++) {
						if( perms[i].userroles[j].name == userRoles ) {
							// usersRole has permission for atleast one of the permission
							// no need to check for other permission
							hasPermissions = true;
							break;
						}
					}
				}
				
				cb(null, true);
				return perms;
				
				}).catch( function(err) {
					console.log("CATCH");		
					console.log(err); 
				});
			});
		}
		




	},
	
		
	/*
	Permission.isAllowed(req.user.id, 'comment', ['can create', 'view own comment', 'view others comment'], function(err, res) {
		if( Permission.exists('comment', ['can create', 'view own comment', 'view others comment']) ) {
			foreach( text )
			{
				if( Permission('comment', 'can create etc.').getAllowedUserRole =isOneOf= UserRole.getUserRole(anonymous||req.user.userrole) ) {

				}
				else {
					return false;
				}
			}
			return true; // whole foreach passed 
		}
		else {
			// Permission does not exists, return true for pass by default. return to stop by default
			return true;
		}
	}),
	*/

};
