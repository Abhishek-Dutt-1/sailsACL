/**
 * Images Controller
 * This handles every thing that has to do with Images
 */

/*
var Imgur = require('imgurjs');
var imgur = new Imgur({
    clientId    : sails.config.imgur.clientId,
    clientSecret: sails.config.imgur.clientSecret
});

sails.log( imgur.album.test() );
sails.log( imgur.album.create1() );
//sails.log( imgur.album.image() );
*/

module.exports = {

    fetchAuthUrl: function (req, res) {
        ImgurService.checkIfAuthorized(function(err, data) {
            if(err) return console.log("Error" + err);
            console.log(data);
        });
        return res.ok( { authUrl: ImgurService.getOauthUrl() } );
        // O/w it should be
        // ImageService.find({name: req.param('services')}).exec(function(err, data) {
        //      return data;
        // });
    },

    /**
     * call back after imgur Auth success
     * This is backend only as the returned query string
     * contains auth code
     */
    loginCallback: function(req, res) {
        imgur.oauth.authorizeCallback( {authCode: req.param('code')} ).then(function(user) {
            //req.session.user = user;
            //res.redirect('/');
            console.log(user);
            return res.ok(user);
        });
    },

    /**
     * Returns all albums belonging to the 
     * official app account
     */
    fetchAllAlbums: function(req, res) {
        imgur.account.albums( { username: sails.config.imgur.appAccountUsername } ).then( function(albums) {
            console.log(albums);
            return res.ok(albums);
        }).catch( function(err) {
            console.log("ERROR");
            console.log(albums);
            return res.badRequest(albums);
        });
    },

    /**
     * Creates a new Album
     * Expects POST {title: 'title-of-album', description: '', privacy: '', layout: ''}
     * Ref: https://api.imgur.com/endpoints/album
     */
    createNewAlbum: function(req, res) {
        var newAlbum = req.allParams();
        //newAlbum.image_id = undefined;
        //newAlbum.comment = undefined;
        delete newAlbum.id;
        console.log(imgur.album.create());
        imgur.album.create(newAlbum);
        return res.ok( newAlbum );
        /*
        imgur.album.create(newAlbum).then(function(data) {
            console.log(data);
            return res.ok(data);
        }).catch(function(err) {
            console.log("ERROR");
            console.log(err);
            return res.badRequest(err);
        });
        */
        //return res.ok( newAlbum );
    },
};
