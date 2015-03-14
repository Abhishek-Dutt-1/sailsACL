/**
* Vote.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        //postId: {type: 'string'},
        votedOn: {
            model: 'post'
        },
        //userId: {type: 'string', required: true},
        votedBy: {
            model: 'user'
        },
        voteType: {type: 'integer', defaultsTo: 1},
        voteValue: {type: 'integer'}    // vote value: +1 , -1
    }
};

