/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        title            : { type: 'string', required: true },
        link             : { type: 'string' },
        description      : { type: 'text' },
        // Type of post: link or text
        type             : { type: 'string', defaultsTo: 'text', required: true },
        image            : { type: 'string' },
        // Location Info -- NOT USED
        // city          : { model: 'cities' },
        // End Location Info
        nsfw             : { type: 'boolean' },
        postedby         : { model: 'user' },
        comments         : { collection: 'comment', via: 'commentedon' },
        votes            : { collection: 'vote', via: 'votedOn' },
        votesUp          : { type: 'integer', defaultsTo: 0 },
        votesDown        : { type: 'integer', defaultsTo: 0 },
        // Post Location Info
        // This location info will be used to fetch geo relevant posts
        // While name is singular, it can hold multiple (hence type = array)
        planetSetting    : { type: 'array' },
        continentSetting : { type: 'array' },
        countrySetting   : { type: 'array' },
        stateSetting     : { type: 'array' },
        citySetting      : { type: 'array' },
        // End Post Location Info
        // Group the post belogs to
        // Keeping it simple for now
        boards: { collection: 'board', via: 'posts' },
    }
};
