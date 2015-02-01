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


    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
