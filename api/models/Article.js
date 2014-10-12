/**
* Article.js
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
            type: 'string',
            required: false
        },
        description: {
            type: 'string',
            required: false 
        },
        group: {
            type: 'string',
            required: true
        },
        geolocation: {
            type: 'string',
            defaultsTo: 'Earth',
            required: true
        },
        // One to many relation b/w User and Article
        postedBy: {
            model: 'user'
        },
        // Many to one relation b/w Article and Comments
        comments: {
            collection: 'comment',
            via: 'articleBelongsTo'
        }
    }
};
