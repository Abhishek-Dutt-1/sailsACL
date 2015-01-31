module.exports.appConfig = {

    constants: {

        // Permissions ::
        // Display text for guest user
        PERM_ANONYMOUS_LABEL:  "Anonymous",
        // If a permission has not been created
        // should it be blocked?
        PERM_BLOCK_UNDEFINED:  false

    },

    // Thease userroles will be created at server start
    // if the dont exist already
    // check config/bootstrap
    initUserroles: [
    /*
        {name: 'The_One'},
        {name: 'Guest'},
        {name: 'Registered'}
        */
    ],

    initPermissions: [
    /*
        { group: 'admin', permission: 'can edit userroles'}
        */
    ],
    
    initAssignPermissions: [
    /*
        { 
            role : {name: 'The_One'}, 
            perm: { group: 'admin', permission: 'can edit userroles'} 
        },
        { 
            role : {name: 'The_One'}, 
            perm: { 'group': 'ui', 'permission': 'show admin menu'} 
        }
        */
    ],

    initSetupACLDefaults: [
        {
            role: {name: 'The_One'}, 
            perm: { group: 'admin', permission: 'can edit userroles'} 
        },
        {
            role: {name: 'The_Two'}, 
            perm: { group: 'admin', permission: 'can edit userroles'} 
        },
        {
            role: {name: 'The_Two'}, 
            perm: { group: 'ui', permission: 'show admin menu'} 
        },
        {
            role: {name: 'The_Two'}, 
            perm: { group: 'ui', permission: 'show admin menu'} 
        },
        {
            role: {name: 'The_Two'}, 
            perm: { group: 'ui', permission: 'DO NOT show admin menu'} 
        },
        {
            role: {name: 'The_Two'}, 
            perm: { group: 'Two', permission: 'can edit userroles2'} 
        },
        {
            role : {name: 'The_One'}, 
        },
        {
            perm: { group: 'admin', permission: 'can edit userroles'} 
        },
        {
            perm: { group: 'ui', permission: 'show admin menu'} 
        },
    ]

}
