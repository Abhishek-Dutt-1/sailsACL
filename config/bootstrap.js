/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var Promise = require('bluebird');

module.exports.bootstrap = function(cb) {

    // Load authentication strategies
    // for npm sails-generate-auth
    sails.services.passport.loadStrategies();

// Start default ACL setup
    // Check/Create default userroles at starting
    // defined in config/appConfig.js
    var promises = []
    var roleArr = [];
    var permArr = [];
    var tempArr = [];
    // assembel all roles and perms in one array and remove duplicates
    sails.config.appConfig.initSetupACLDefaults.forEach( function(acl) {
        if(acl.role) roleArr.push(acl.role);
        if(acl.perm) permArr.push(acl.perm);
    });
    // remove dupes
    for(var i=0; i < roleArr.length; i++) {
        // unique on 'name'
        tempArr[roleArr[i]['name']] = roleArr[i];
    };
    roleArr = new Array();
    for(var key in tempArr) {
        roleArr.push(tempArr[key]);
    };
    // remove dupes
    tempArr = [];
    for(var i=0; i < permArr.length; i++) {
        // Unique on 'group' AND 'permission'
        tempArr[ permArr[i]['name'] + " - " + permArr[i]['permission'] ] = permArr[i];
    };
    permArr = new Array();
    for(var key in tempArr) {
        permArr.push(tempArr[key]);
    };
    roleArr.forEach(function(role) { 
        // still use findOrCreate if sails lifting using old data
        promises.push( Userrole.findOrCreate(role, role) );
    });
    permArr.forEach(function(perm) { 
        // still use findOrCreate if sails lifting using old data
        promises.push( Permission.findOrCreate(perm, perm) );
    });

    var relationExists = false;

    Promise.all(promises).then(function(tmp) {
        // all rolse and perms created, now assigns
        sails.config.appConfig.initSetupACLDefaults.forEach( function(acl) {
            if(acl.role && acl.perm) {
                Userrole.findOne(acl.role).then(function(role) {
                    Permission.findOne(acl.perm).populate('userroles').exec(function(err1, perm) {
                        if(err1) console.log(err1);
                        // check if the current permission->userrole relation to be 
                        // added does not already exists.
                        // sails throws error isntead of simply overwriting the relation
                        // This will fail if two new exactly same {role, perm} are added
                        // due to asyncronousity of .save()
                        relationExists = false;
                        perm.userroles.forEach( function(userrole) {
                            // this should be by name instead of id
                            if(userrole.id == role.id) {
                                relationExists = true;
                            };
                        });
                        // save the relation
                        if(relationExists === false) {
                            perm.userroles.add(role.id);
                            perm.save(function(err2, res) {
                                if(err2) {
                                    console.log("Error assigning default permissions");
                                    console.log(err2);
                                }
                            });
                        };
                    });
                });
            };
        });
    }).catch(function(err) { 
        console.log(err);
    });
/////////////////// End default ACL setup

    // Create default users
    // defined in local.js
    sails.config.appConfig.initAdminUsers.forEach(function(user) {

        var userroles;
        if(user.userroles && user.userroles.length > 0) {
            userroles = user.userroles;
            delete user.userroles;
        }
        User.findOrCreate({email: user.email}, user).exec(function(err, newUser) {
            if(err) console.log(err);
            console.log(newUser);

            // THis does not work as foundUserroles is empty []
            // TODO:: Change this to promise and link with above
            // Prob create all models first then() add relations
            if(userroles && userroles.length > 0) {
                Userrole.find(userroles).exec(function(err, foundUserroles) {
                    console.log("Finding Userroles");
                    console.log(userroles);
                    console.log("Found Usrroles");
                    console.log(foundUserroles);
                    foundUserroles.forEach(function(foundUserrole) {
                        // add() does not takes array
                        newUser.userroles.add(foundUserrole.id);
                    });
                    newUser.save(function(err, res) {
                        console.log("Saving wiht userrole");
                        //console.log(res); 
                    });
                });
            };
            

            Passport.findOrCreate({user: newUser.id, protocol: 'local'}, {
                protocol: 'local',
                password: user.password,
                passwordConfirmation: user.password,
                user: newUser.id
            }).exec(function(err2, passport) {
                if(err2) console.log(err2);
                //console.log(passport);
            });
        });

    });

    /** 
     * Create default models
     */
    sails.config.appConfig.defaultModels.forEach(function(model) {
        createDefaultModels(model);
    });


    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};

// Create a model
var createDefaultModels = function(model) {
    if(model.type === "cities") {
        Cities.findOrCreate(model.data, model.data).exec(function(err, createdModel) {
            if(err) {
                console.log(err);
                return err;
            }
        });
    }
};
