/**
 * BoardController
 *
 * @description :: Server-side logic for managing boards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
    // Create new board
    // This is reauired instead of directly using Sails routes 
    // As we need to fetch req.authToken
    createnewboard: function(req, res) {
        // Check permission // Use the permission system :: TODO
        if(!req.authToken) return res.badRequest('Must be logged in to vote');
        var board = req.params.all();
        board.createdby = req.authToken;    // dont trust frontend
        board.owner = board.createdby;      // New board, createdby = owner
        Board.create(board).exec(function(err, newBoard) {
            return res.ok(newBoard);
        });
    }

};

