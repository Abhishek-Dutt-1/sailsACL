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
            role: {name: 'The_One'}, 
            perm: { group: 'Test', permission: 'Test permission'} 
        }
    ],

    // Defualt userrole assigned to a new registered user
    // must be already created by initSetupACLDefaults above
    // ref User.js model
    defaultUserroles: {
        unverifiedEmail: {name: 'Unverified Email'},
        verifiedEmail: {name: 'Registered'},
    },

    // Defaults for Guest user (used by UI), given userroles must also be defined above
    defaultUsers: {
        unregisteredUser: { firstname: 'Guest', lastname: '', userroles: [{name: 'Guest'}] },
    },

    // Address of frontend, used by EmailService to verify email id
    frontEnd: {
        url: 'http://localhost:9000/#',
        adminEmail: 'abhishek.india@gmail.com'
    },
}
