/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
       body: {
            type: 'string',
            required: true
        },
        // one to many realtion b/w user and comments
        postedby: {
            model: 'user'
        },

        // Post to which this comment is directly commented on to
        commentedon: {
            model: 'post'
        },

        // If the comment is not directly to a post but to comment
        parentComment: {
            model: 'comment'
        },
        childComments: {
            collection: 'comment',
            via: 'parentComment'
        },
        // many to one relation b/w article and a comment
        /*
        articleBelongsTo: {
            model: 'article'
        },
        */
        // one to many relation b/w comment and other comment
        // i.e. a comment can be a reply to another comment
        // and many other comments can reply to same comment
        /*
        replyTo: {
            model: 'comment'
        },
        replies: {
            collection: 'comment',
            via: 'replyTo'
        }
        */

    }

};

