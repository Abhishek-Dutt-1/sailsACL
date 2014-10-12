/**
 * DevController
 *
 * @description :: Server-side logic for managing devs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	index: function(req, res) {
				res.view();
			},
	
	crud: function(req, res) {
                //res.send(req.param('model'));
                var list;

                switch( req.param('model') ) {
                    case 'user': list = User.find({}); break;
                }

                list.populateAll().exec( function(err, list1) {
                    if(err) return res.serverError(err);
                    header = Object.keys(list1[0]);
                    res.view('dev/crud', {data: list1 } );
                });
			}

};

