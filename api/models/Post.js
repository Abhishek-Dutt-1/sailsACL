/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        title: {
            type: 'string',
            required: true
        },
        link: {
            type: 'string'
        },
        description: {
            type: 'text'
        },
        // Type of post: link or text
        type: {
            type: 'string',
            defaultsTo: 'text',
            required: true
        },
        image: {
            type: 'string'
        },
        /*
        geo: {
        },
        */
        nsfw: {
            type: 'boolean'
        },
        postedby: {
            model: 'user'
        },
        comments: {
            collection: 'comment',
            via: 'commentedon'
        },
        votes: {
            collection: 'vote',
            via: 'votedOn'
        },
        votesUp: {type: 'integer', defaultsTo: 0},
        votesDown: {type: 'integer', defaultsTo: 0},
    }
};

