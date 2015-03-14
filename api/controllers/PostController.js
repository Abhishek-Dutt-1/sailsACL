/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    // added 'commentid' to post 'comments'
    addCommentToPost: function(req, res) {
        Post.findOne({id: req.param('postid')}, function(err, post) {
            if(err) return err;
            if(!post) {
                console.log("Post not found");
                return res.badRequest("The Post being commented on is not found.");
            } else {
                post.comments.add(req.param('commentid'));
                post.save(function(err2, savedPost) {
                    if(err2) return err2;
                    //return res.ok({data: "Comment added to post."});
                    return res.ok({savedPost: savedPost});
                });
            };
        });
    },

    // Return queried post by id but does not
    // populate comments
    listAllPosts: function(req, res) {
        Post.find({}).populate('postedby').exec(function(err, posts) {
            if(err) return err;
            return res.ok(posts);
        });
    },

    // Return a SINGLE post by id, deep populating associations
    getPostById: function(req, res) {

        Post.findOne(req.allParams()).populate('postedby').populate('comments').exec(function(err, post) {
// get array of child comments ids
// find all of them with populated fields
// loop through post comments, attach child comments
// profit
            // modifing original found 'post' seems to not work
            var post2 = _.clone(post);
            delete post2.comments;      // comments does not have postedby, childComments

            if(err) return err;
            var commentIds = []
            var childCommentIds = [];
            post.comments.forEach(function(comment) {
                commentIds.push(comment.id);       // lvl 1 comments
            });

            Comment.find({id: commentIds}).populate('postedby').populate('childComments').then(function(comments) {
                post2.comments = comments;  // lvl 1 comments, now have postedby, childCommetns, but childComments do not have postedby

                comments.forEach(function(comment) {
                    comment.childComments.forEach(function(childComment) {
                        childCommentIds.push(childComment.id);
                    });
                });
                return childCommentIds;
            }).then(function(childCommentsIds) {

                Comment.find({id: childCommentIds}).populate('postedby').exec(function(err2, comments2) {
                    post2.comments.forEach(function(comment) {
                        comment.childComments.forEach(function(childComment, index, arr) {
                            var tmp = _.find(comments2, {'id': childComment.id});
                            arr[index] = tmp;
                        });
                    });
                    return res.send(post2);
                });
            }).catch(function(err) {
                console.log(err);
                return res.serverError(err);
            });
        }); // end Post.findOne

/*
            Comment.find({id: commentIds}).populate('postedby').populate('childComments').exec(function(err, comments) {
                post2.comments = comments;  // lvl 1 comments, now have postedby, childCommetns, but childComments do not have postedby

                comments.forEach(function(comment) {
                    comment.childComments.forEach(function(childComment) {
                        childCommentIds.push(childComment.id);
                    });
                });

                Comment.find({id: childCommentIds}).populate('postedby').exec(function(err2, comments2) {

                    post2.comments.forEach(function(comment) {
                        comment.childComments.forEach(function(childComment, index, arr) {
                            var tmp = _.find(comments2, {'id': childComment.id});
                            console.log(tmp);
                            arr[index] = tmp;
                        });
                    });
                    return res.send(post2); 
                });
           });
*/
/*
        // req.allParams() because couldn't find how to get :id from the url
        Post.findOne(req.allParams()).populate('postedby').populate('comments').then(function(post) {
            var commentUsers = User.find( {id: _.pluck(post.comments, 'postedby')} ).then(function(commentUsers) { return commentUsers; });
            return [post, commentUsers];
        }).spread(function(post, commentUsers) {
            var commentUsers = _.indexBy(commentUsers, 'id');
            post.comments = _.map(post.comments, function(comment) {
                comment.postedby = commentUsers[comment.postedby];
                return comment
            });
            res.json(post);
        }).catch(function(err) {
            if(err) {
                return res.serverError(err);
            };
        });
*/
    },

    _config: {
        shortcuts: false
    }
};

