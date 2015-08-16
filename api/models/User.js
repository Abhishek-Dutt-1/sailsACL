//var User = {
module.exports = {
    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        firstname : { type: 'string' },
        lastname  : { type: 'string' },
        // username  : { type: 'string', unique: true },
        // Maybe later this could be used for vanity url
        // for now this is being filled automatically by beforeCreate function
        username  : { type: 'string', unique: false, defaultsTo: null },
        email     : { type: 'email',  unique: true, required: true },
        emailVerificationToken: { type: 'string', required: false },     // token sent in verification email during registration
        emailVerificationTokenExpires: { type: 'datetime', required: false },  
        isAdmin   : { type: 'boolean', required: false, defaultsTo: false },    // 
        passports : { collection: 'Passport', via: 'user' },

        // Add a One Way Relation to UserRoles
        userroles: {
            collection: 'userrole',
            //via: 'userrolee',    // corresponding to Userrole
            //dominant: true
        },
        boardscreated: { collection: 'board', via: 'createdby' },
        boardsowned: { collection: 'board', via: 'owner' },
        // one to many relation to track users articles
        posts: {
            collection: 'post',
            via: 'postedby'
        },
        // one to many relation to track users comments
        comments: {
            collection: 'comment',
            via: 'postedby'
        },
        // Track User's votes
        votes: {
            collection: 'vote',
            via: 'votedBy'
        },
        // Location Info :: Profile
        // This location info will be tagged to users post
        planet    : { type: 'array' },
        continent : { type: 'array' },
        country   : { type: 'array' },
        state     : { type: 'array' },
        city      : { type: 'array' },
        // End Location Info
        // Location Info :: Settings
        // This location info will be used to fetch geo relevant posts
        // While name is singular, it can hold multiple (hence type = array)
        planetSetting    : { type: 'array' },
        continentSetting : { type: 'array' },
        countrySetting   : { type: 'array' },
        stateSetting     : { type: 'array' },
        citySetting      : { type: 'array' },
        // End Location Settings Info
    },

    /**
    * Callback to be run before creating a User.
    *
    * @param {Object}   user The soon-to-be-created User
    * @param {Function} next
    */
    beforeCreate: function (user, next) {
        // for now set username 
        user.username = user.email;
        /* This did not work */
        // check bootstrap config file
        /*
        var defaultUserrole = {name: 'Registered'};
        Userrole.findOne(defaultUserrole).exec(function(err, role) {
            if(err) {
                console.log("Could not find default userrole");
                next();
            }
            user.firstname = "BEFORE CREATE";
            user.userroles.add(role.id);
            console.log("--__--");
            console.log(user);
            console.log("--__--");
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
    	var configDefaultUserrole = sails.config.appConfig.defaultUserroles.unverifiedEmail;
        Userrole.findOne( configDefaultUserrole ).exec(function(err, defaultUserrole) {
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
