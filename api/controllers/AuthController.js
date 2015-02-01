var jwt = require('jsonwebtoken');
var crypto = require('crypto');

    // Private function to re/send email verification
var sendEmailVerificationEmail = function(user) {
    crypto.randomBytes(48, function(ex, buf) {
        var emailToken = buf.toString('hex');
        user.emailVerificationToken = emailToken;
        user.emailVerificationTokenExpires = Date.now() + 3600000 * 24 * 7;
        user.save(function(err, savedUser) {
            if(err) return err;
            console.log(savedUser);
            EmailService.sendEmailVerificationEmail( {firstname: savedUser.firstname, lastname: savedUser.lastname, email: savedUser.email, token: savedUser.emailVerificationToken} );
        });
    });
};


/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var AuthController = {
  /**
   * Render the login page
   *
   * The login form itself is just a simple HTML form:
   *
      <form role="form" action="/auth/local" method="post">
        <input type="text" name="identifier" placeholder="Username or Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign in</button>
      </form>
   *
   * You could optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!documentation/config.csrf
   *
   * A simple example of automatically listing all available providers in a
   * Handlebars template would look like this:
   *
      {{#each providers}}
        <a href="/auth/{{slug}}" role="button">{{name}}</a>
      {{/each}}
   *
   * @param {Object} req
   * @param {Object} res
   */
  login: function (req, res) {
    var strategies = sails.config.passport
      , providers  = {};

    // Get a list of available providers for use in your templates.
    Object.keys(strategies).forEach(function (key) {
      if (key === 'local') {
        return;
      }

      providers[key] = {
        name: strategies[key].name
      , slug: key
      };
    });

    // Render the `auth/login.ext` view
    res.view({
      providers : providers
    , errors    : req.flash('error')
    });
  },

  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  /**
   * Render the registration page
   *
   * Just like the login form, the registration form is just simple HTML:
   *
      <form role="form" action="/auth/local/register" method="post">
        <input type="text" name="username" placeholder="Username">
        <input type="text" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign up</button>
      </form>
   *
   * @param {Object} req
   * @param {Object} res
   */
  register: function (req, res) {
    res.view({
      errors: req.flash('error')
    });
  },

  /**
   * Create a third-party authentication endpoint
   *
   * @param {Object} req
   * @param {Object} res
   */
  provider: function (req, res) {
    passport.endpoint(req, res);
  },

  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
    callback: function (req, res) {

        function tryAgain (err) {
            // Only certain error messages are returned via req.flash('error', someError)
            // because we shouldn't expose internal authorization errors to the user.
            // We do return a generic error and the original request body.
            var flashError = req.flash('error')[0];

            if (err && !flashError ) {
                req.flash('error', 'Error.Passport.Generic');
            } else if (flashError) {
                req.flash('error', flashError);
            }
            req.flash('form', req.body);

            // If an error was thrown, redirect the user to the
            // login, register or disconnect action initiator view.
            // These views should take care of rendering the error messages.
            var action = req.param('action');

            switch (action) {
                case 'register':
                    res.redirect('/register');
                    break;
                case 'disconnect':
                    res.redirect('back');
                    break;
                default:
                    res.redirect('/login');
            }
        }

        passport.callback(req, res, function (err, user) {
            if (err) {
                return res.send(401, err);
                return res.send(401, "AuthController:: Registeration Failed.");
                //return tryAgain();
            }

            // Currently AUTO LOGIN new user after registering if no errors
            // else give an if(req.param('action') to check the action
            // req.param('action') == 'register' for register, undefined for login
            // chech switch above in tryAgain()
            // Send email
            if(req.param('action') == 'register') {
                sendEmailVerificationEmail(user);
                /*
                crypto.randomBytes(48, function(ex, buf) {
                    var emailToken = buf.toString('hex');
                    user.emailVerificationToken = emailToken;
                    user.emailVerificationTokenExpires = Date.now() + 3600000 * 24 * 7;

                    user.save(function(err, savedUser) {
                        if(err) return err;
                        console.log(savedUser);
                        EmailService.sendEmailVerificationEmail( {firstname: savedUser.firstname, lastname: savedUser.lastname, email: savedUser.email, token: savedUser.emailVerificationToken} );
                    });
                });
                */
            }

            req.login(user, function(err) {
                if (err) {
                    console.log(err);
                    //return err;
                    return res.send(401, "AuthController:: Login Failed.");
                    //return tryAgain();
                };

                // Upon successful login, send the user to the homepage were req.user
                // will available.
                ////////////////////////////////FINALLY SEND THE TOKEN
                var token = jwt.sign(user.id, 'CHANGE_THIS_VALUE');
                User.findOne(user.id).populate('userroles').exec(function(err, user) {
                    return res.send({token: token, user: req.user});
                });
                
                //return res.send(req.user);
                //res.redirect('/');
            });
        });
    },

    /**
    * Disconnect a passport from a user
    *
    * @param {Object} req
    * @param {Object} res
    */
    disconnect: function (req, res) {
        passport.disconnect(req, res);
    },

    getDefaultUsers: function(req, res) {
        return res.send(sails.config.appConfig.defaultUsers );
    },

    // verfiy email based on token send to the registered email
    verifyEmail: function(req, res) {
        console.log(req.param('token'));
        User.findOne({emailVerificationToken: req.param('token'), emailVerificationTokenExpires: { '>': Date.now() }  }, function(err, user) {
            if(!user) {
                console.log("Token Error");
                console.log(err);
                return res.send("Password Token is invalid or expiered");
            } else {
                user.emailVerificationToken = null;
                user.emailVerificationTokenExpires = false;

                var unverifiedEmailUserrole = sails.config.appConfig.defaultUserroles.unverifiedEmail;
                var verifiedEmailUserrole = sails.config.appConfig.defaultUserroles.verifiedEmail;
                // Look for id
                Userrole.findOne( unverifiedEmailUserrole ).then(function(defaultUserrole) {
                    if (defaultUserrole) {
                        user.userroles.remove(defaultUserrole.id);
                    }
                }).then(Userrole.findOne( verifiedEmailUserrole ).exec(function(err, defaultUserrole) {
                    if(err) return err;
                    if (defaultUserrole) {
                        user.userroles.add(defaultUserrole.id);
                    }
                    user.save(function(err2, savedUser) {
                        if(err2) return err2;
                        return res.send("Yo! All Done.");
                    });
                }));
            };
        });
    },
};

module.exports = AuthController;
