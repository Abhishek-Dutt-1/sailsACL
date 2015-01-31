//var User = {
module.exports = {
    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        firstname : { type: 'string', unique: false },
        lastname  : { type: 'string', unique: false },
        // username  : { type: 'string', unique: true },
        // Maybe later this could be used for vanity url
        // for now this is being filled automatically by beforeCreate function
        username  : { type: 'string', unique: false, defaultsTo: null },
        country   : { type: 'string', unique: false },
        email     : { type: 'email',  unique: true, required: true },
        passports : { collection: 'Passport', via: 'user' },

        // Add a One Way Relation to UserRoles
        userroles: {
            collection: 'userrole',
            //via: 'userrolee',    // corresponding to Userrole
            //dominant: true
        },
        // one to many relation to track users articles
        articles: {
            collection: 'article',
            via: 'postedBy'
        },
        // one to many relation to track users comments
        comments: {
            collection: 'comment',
            via: 'postedBy'
        },
    },

  /**
   * Callback to be run before creating a User.
   *
   * @param {Object}   user The soon-to-be-created User
   * @param {Function} next
   */
  beforeCreate: function (user, next) {
	user.username = user.email;
	/* This did not work */
	// check bootstrap config file
    /*
	var defaultUserrole = {name: 'Registered'};
	Userrole.findOne(defaultUserrole).exec(function(err, role) {
        user.firstname = "BEFORE CREATE";
        console.log(role);
		console.log(user);
		user.userroles = [role.id];
		console.log("--__--");
		console.log(user);
		console.log("--__--");
        console.log(next);
		next();
	});
    */
	next();
  },

// Custom function to create a user
// this is just to create a default userrole
//see: http://stackoverflow.com/questions/27971878/sailsjs-add-one-to-many-association-to-a-model-during-beforecreate
  createUserWithDefaults: function(data, cb) {
    // If there are already userroles specified, just use those
    if (data.userroles) {return User.create(data).exec(cb);}
    // Otherwise look up the default userrole
	// check bootstrap config file for defaults //
    Userrole.findOne( {name: "Registered"} ).exec(function(err, defaultUserrole) {
      // Return in case of error
      if (err) {return cb(err);}
      // Assuming the default pet exists, attach it
      if (defaultUserrole) {
        console.log("SETTING DEFAULT Userrole", defaultUserrole.id);
        data.userroles = [defaultUserrole.id];
      }
      // Create the user
      return User.create(data).exec(cb);
    });
  },

};

//module.exports = User;
