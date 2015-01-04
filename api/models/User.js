var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
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

  }
};

module.exports = User;
