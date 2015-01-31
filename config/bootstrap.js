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

    var promises = []
    // Check/Create default userroles at starting
    // defined in config/appConfig.js
    sails.config.appConfig.initUserroles.forEach( function(role) {
        promises.push( Userrole.findOrCreate(role, role) );
        /*
        Userrole.findOrCreate(role, role).exec(function(err, role) {
        });
        */
    });
    sails.config.appConfig.initPermissions.forEach( function(perm) {
        promises.push( Permission.findOrCreate(perm, perm) );
        /*
        Permission.findOrCreate(perm, perm).exec(function(err, perm) {
        });
        */
    });
    Promise.all(promises).then(function(tmp) {
        sails.config.appConfig.initAssignPermissions.forEach( function(assoc) {
            /*
            Userrole.findOrCreate( assoc.role, assoc.role ).exec(function(err, role) {
                //console.log(err);
                //console.log(assoc);
                Permission.findOrCreate( assoc.perm, assoc.perm ).exec(function(err2, perm) {
                    //console.log(err2);
                    //console.log(perm);
                    var permUpdate = perm;
                    delete permUpdate.id;
                    permUpdate.userroles = [];
                    permUpdate.userroles.push(role.id);
                    console.log(perm.id);
                    console.log(permUpdate);
                    Permission.update(perm.id, permUpdate).exec(function(err3, perm3) {
                        console.log(err3);
                        console.log(perm3);
                    });
                });
                */
                assoc.perm.userroles = [role.id];
                Permission.update(assoc.perm).exec(function(err, perm2){ 
                    console.log(err);
                    console.log(perm2); 
                });
            });

    }).error(function(err) {
        console.log("Init: Error at setting defaults");
    });
//////////////////////////////////////////////

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
    }
    roleArr = new Array();
    for(var key in tempArr) {
        roleArr.push(tempArr[key]);
    }
    // remove dupes
    tempArr = [];
    for(var i=0; i < permArr.length; i++) {
        // Unique on 'group' AND 'permission'
        tempArr[ permArr[i]['name'] + " - " + permArr[i]['permission'] ] = permArr[i];
    }
    permArr = new Array();
    for(var key in tempArr) {
        permArr.push(tempArr[key]);
    }

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
                    Permission.findOne(acl.perm).populate('userroles').exec(function(err, perm) {
                        // check if the current permission->userrole relation to be added does not already exists
                        // sails throws error isntead of simply overwriting the relation
                        relationExists = false;
                        perm.userroles.forEach( function(userrole) {
                            if(userrole.id == role.id) {
                                relationExists = true;
                            }
                        });
                        // save the relation
                        if(!relationExists) {
                            perm.userroles.add(role.id);
                            perm.save(function(err2, res) {
                                if(err2) {
                                    console.log("Error assigning default permissions");
                                    console.log(err2);
                                }
                            });
                        }
                   });
                });
            }
        });
    }).catch(function(err) { 

    });

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
