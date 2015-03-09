/**
 * CommentController
 *
 * @description :: Server-side logic for managing Comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    // Add comment reply to a parent comment
    addReplyToComment: function(req, res) {
        Comment.findOne({id: req.param('parentcommentid')}, function(err, comment) {
            if(err) return err;
            if(!comment) {
                console.log("Comment not found");
                return res.badRequest("The Comment being commented on is not found.");
            } else {
                comment.childComments.add(req.param('commentid'));
                comment.save(function(err2, savedComment) {
                    if(err2) return err2;
                    //return res.ok({data: "Comment added to post."});
                    return res.ok({savedComment: savedComment});
                });
            };
        });
    },

    _config: {
        shortcuts: false
    }
};

