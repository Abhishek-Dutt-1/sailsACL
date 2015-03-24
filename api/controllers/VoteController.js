/**
 * VoteController
 *
 * @description :: Server-side logic for managing Votes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    // Add a vote to a post by userid	
    // Does both upvote and down vote (inspite of the name)
    // POST
    addVoteToPost: function(req, res) {

        // Check permission
        if(!req.authToken) return res.badRequest('Must be logged in to vote');

        // req.params.all() has the vote object, same as the Vote model
        // 1. Create a new vote
        var vote = req.params.all();
        vote.votedBy = req.authToken;   // dont trust front end
        //Vote.create(req.params.all()).then(function(newVote) {
        Vote.create(vote).then(function(newVote) {

            //console.log(newVote);
            //console.log( req.param('votedOn') );
            // 2. Find post voted on
            Post.findOne(req.param('votedOn')).exec(function(err, post) {
                if(err) return err;
                // 3. Increment vote counters cache
                if(req.param('voteValue') > 0) {
                    post.votesUp = post.votesUp + 1;
                } else {
                    post.votesDown = post.votesDown + 1;
                };
                // 4. Save the post
                post.save(function(err2, savedPost) {
                    if(err2) return err2;
                    return res.ok(savedPost);
                });
            });

        }).catch(function(err) {
            return err;
        });
    },

    // Undo a user's vote
    cancelUsersVote: function(req, res) {

        // Check permission
        if(!req.authToken) return res.badRequest('Must be logged in to vote');

/*
    var vote = {
        votedOn: post.id,
        votedBy: AuthenticationService.getCurrentUser().id,
        voteType: 1,
        voteValue: -1,  // Vote value is required if user has given both upvote and downvote, then cancel only the required vote
    };
*/
        var vote = req.params.all();
        delete vote.id;
        vote.votedBy = req.authToken;   // dont trust front end
        //console.log("Deleting this vote");
        //console.log(vote);
        Vote.destroy(vote).exec(function(err, deletedVote) {
            //console.log("Deleted this vote");
            //console.log(deletedVote);
            if(err) return err;
            Post.findOne(req.param('votedOn')).exec(function(err2, post) {
                //console.log(post);
                if(req.param('voteValue') > 0) {
                    post.votesUp = post.votesUp - 1;
                } else {
                    post.votesDown = post.votesDown - 1;
                };

                post.save(function(err3, savedPost) {
                    if(err3) return err3;
                    return res.ok(savedPost);
                });
            });
        });
        //return res.ok(req.params.all());
    },
};

