/**
* Permission.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    group: {
        type: 'string',
        required: true
    },
    permission: {
		type: 'string',
		required: true
    },
    description: {
		type: 'string',
		required: false
    },
	// Add a One Way Relation to UserRoles
	userroles: {
		collection: 'userrole'
	}
  }
  
};

