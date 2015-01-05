var User = {
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
            collection: 'userrole'
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
	console.log(user);
	user.username = user.email;
	next();
  },

};

module.exports = User;
