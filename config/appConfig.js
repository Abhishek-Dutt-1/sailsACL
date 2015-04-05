module.exports.appConfig = {

    constants: {
        // Permissions ::
        // Display text for guest user
        PERM_ANONYMOUS_LABEL:  "Anonymous",
        // If a permission has not been created
        // should it be blocked?
        PERM_BLOCK_UNDEFINED:  false

    },

    // Thease userroles and permissions will be created at server lift
    // if the dont exist already
    // check config/bootstrap
    initSetupACLDefaults: [
        {
            // Default userrole for new registered user
            role: {name: 'Registered'},
        },
        {
            // Defualt userrole for non logged in user
            role: {name: 'Guest'},
        },
        {
            // Default userrole for newly registered user
            role: {name: 'Unverified Email'}
        },
        {
            role: {name: 'Moderator'}, 
            perm: { group: 'Test', permission: 'Test permission'} 
        },
        {
            role: {name: 'Registered'},
            perm: {group: 'post', permission: 'can create post'}
        },
        {
            role: {name: 'Moderator'},
            perm: {group: 'post', permission: 'can create post'}
        },
        {
            role: {name: 'Registered'},
            perm: {group: 'post', permission: 'can delete own post'}
        },
        {
            role: {name: 'Unverified Email'},
            perm: {group: 'post', permission: 'can delete own post'}
        },
        {
            role: {name: 'Moderator'},
            perm: {group: 'post', permission: 'can delete own post'}
        },
        {
            role: {name: 'Registered'},
            perm: {group: 'post', permission: 'can edit own post'}
        },
        {
            role: {name: 'Unverified Email'},
            perm: {group: 'post', permission: 'can edit own post'}
        },
        {
            role: {name: 'Moderator'},
            perm: {group: 'post', permission: 'can edit own post'}
        },
        {
            perm: {group: 'post', permission: 'can delete any post'}
        },
        {
            perm: {group: 'post', permission: 'can edit any post'}
        },
        {
            role: {name: 'Registered'},
            perm: {group: 'comment', permission: 'can create comment'}
        },
        {
            role: {name: 'Registered'},
            perm: {group: 'comment', permission: 'can delete own comment'}
        },
        {
            role: {name: 'Moderator'},
            perm: {group: 'comment', permission: 'can delete any comment'}
        },
        {
            role: {name: 'Registered'},
            perm: {group: 'vote', permission: 'can vote on own post'}
        },
        {
            role: {name: 'Registered'},
            perm: {group: 'vote', permission: 'can vote on any post'}
        },
        {
            role: {name: 'Moderator'},
            perm: {group: 'vote', permission: 'can vote on own post'}
        },
        {
            role: {name: 'Moderator'},
            perm: {group: 'vote', permission: 'can vote on any post'}
        },
 
    ],

    // Defualt userrole assigned to a new registered user
    // must be already created by initSetupACLDefaults above
    // ref User.js model
    defaultUserroles: {
        unverifiedEmail: {name: 'Unverified Email'},
        verifiedEmail: {name: 'Registered'},
    },

    // Defaults for Guest user (used by UI), given userroles must also be defined above
    // This user is created at bootstrap (check local.js) with id:2
    unregisteredUser: { email: 'guest@user.com' },
    /*
    defaultUsers: {
        unregisteredUser: { firstname: 'Guest', lastname: '', email: 'guest@user.com', userroles: [{name: 'Guest'}] },
    },
    */

    // Address of frontend, used by EmailService to verify email id
    frontEnd: {
        url: 'http://localhost:9000/#',
        adminEmail: 'abhishek.india@gmail.com'
    },

    // Init default models
    defaultModels: [
        // ASIA
        {
            type: "cities",
            data: {continent: "Asia", country: "India", state: "Uttar Pradesh", city: "Lucknow"}
        },
        {
            type: "cities",
            data: {continent: "Asia", country: "India", state: "Karnataka", city: "Bangalore"}
        },
        // NORTH AMERICA
       {
            type: "cities",
            data: {continent: "North America", country: "USA", state: "Texas", city: "Huston"}
        }
    ],
}
