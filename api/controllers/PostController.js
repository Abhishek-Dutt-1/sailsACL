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
        // Query object is an OR array
        // Ref sails docs
        var query = {or: []};
        var boardQuery;
        /*
        console.log( req.allParams() );
        console.log( req.body );
        console.log( req.param('boards') );
        console.log( req.param('planetSetting') );
        console.log( req.param('planetSetting').length );
        console.log( req.param('continentSetting') );
        console.log( req.param('continentSetting').length );
        console.log( req.param('countrySetting') );
        console.log( req.param('countrySetting').length );
        */
        if( req.param('boards') ) {
            //query.boards = req.param('boards');
            //query.boards = [];
            boardQuery = req.param('boards');
            //console.log(boardQuery);
        }
        if ( req.param('planetSetting').length > 0) {
            query.or.push( {planetSetting: req.param('planetSetting')} );
        }
        if ( req.param('continentSetting').length > 0) {
            query.or.push( {continentSetting: req.param('continentSetting')} );
        }
        if ( req.param('countrySetting').length > 0) {
            query.or.push( {countrySetting: req.param('countrySetting')} );
        }
        //console.log(query);

        Post.find( query ).populate('postedby').populate('boards').exec(function(err, posts) {
            if(err) return err;
            //console.log(posts);
            // Filter out non board posts if board is sepcified
            if(boardQuery) {
                Board.find( boardQuery ).exec(function(err, foundBoards) {
                    //console.log("Found Boards");
                    //console.log(foundBoards);
                    posts = posts.filter(function(post, index, arr) {
                        var boardMatch = false;
                        post.boards.forEach(function(board) {
                            //console.log("POST BOARD");
                            //console.log(board);
                            foundBoards.forEach(function(foundBoard) {
                                if(board.name === foundBoard.name) {
                                    //console.log("Matched! : " + board.name);
                                    boardMatch = true;
                                }
                            });
                        });
                        //console.log("FINALLY");
                        //console.log(post)
                        //console.log(boardMatch);
                        return boardMatch;
                        /*
                        if(!boardMatch) {
                            console.log("DEleting non match");
                            console.log(post);
                            delete arr[index];
                        };
                        */
                    });
                    return res.ok(posts);
                });
            } else {
                return res.ok(posts);
            }
            //return res.ok(posts);
        });
    },

    // Return a SINGLE post by id, deep populating associations
    getPostById: function(req, res) {

        //return res.json( req.authToken );
        Post.findOne(req.param('id')).populate('postedby').populate('boards').populate('comments').populate('votes', {'votedBy': req.authToken}).exec(function(err, post) {

// get array of child comments ids
// find all of them with populated fields
// loop through post comments, attach child comments
// profit
            // modifing original found 'post' seems to not work
            var post2 = _.clone(post);
//            delete post2.comments;      // comments does not have postedby, childComments

            if(err) return err;
            var commentIds = [];
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

    /**
     * Save a post
     * This handels saving boards with the post
     */
    savePostWithBoard: function(req, res) {
        console.log( req.allParams() );
        console.log( req.param('boards') );
        var boards = req.param('boards');
        var post = req.allParams(); 
        delete post.id;
        delete post.boards;
        Post.create(post).exec(function(err, savedPost) {
           
            // Find all boards
            Board.find({name: boards}).then(function(foundBoards) {
                console.log("Found Boards");
                console.log(foundBoards);
                // add() does not accepts arrays
                foundBoards.forEach(function(foundBoard) {
                    savedPost.boards.add(foundBoard.id);
                });
                return savedPost;
            }).then(function(savedPost) {
                console.log(savedPost);
                savedPost.save(function(err, success) {
                    if(err) return res.badRequest(err);
                    console.log(success);
                    return res.ok(success);
                });
            });

        });
        console.log(boards);
        console.log(post);
    },

    _config: {
        shortcuts: false
    }
};

