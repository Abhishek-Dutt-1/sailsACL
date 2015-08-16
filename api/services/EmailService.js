var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport( smtpTransport( sails.config.mandrill ) );

/*
var server = {
    URL: 'http:/localhost:1337',
    senderEmail: 'abhishek.india@gmail.com'
};
*/
var frontend = sails.config.appConfig.frontEnd;

module.exports = {

    sendEmail: function(mailOptions, cb) {

        var defaultMailOptions = {
            /*
            from: 'abhishek.india@gmail.com', // sender address
            to: 'abhishek.india@gmail.com', // list of receivers
            subject: 'Default Hello ✔', // Subject line
            text: 'Hello world ✔', // plaintext body
            html: '<b>Hello world ✔</b>' // html body
            */
        };

        var mailOptions = mailOptions || defaultMailOptions;

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                console.log(error);
                cb(error);
            } else {
                console.log('Message sent: ' + info.response);
                cb(null, info);
            }
        });
    },

    // send email verficatrion for new registered users.
    sendEmailVerificationEmail: function( receiver, cb ) {

        var mailOptions = {
            from: 'abhishek.india@gmail.com', // sender address
            to: 'abhishek.india@gmail.com', // list of receivers
            subject: 'Hi! Verfiy your email.', // Subject line
            text: 'Hello world ✔', // plaintext body
            html: '<b>Hello world ✔</b>' // html body
        };
        
        var text = 'Hi ' + receiver.firstname + '! \r\n';
        text += 'Please verify your email by clicking the following link: \r\n';
        text += frontend.url + '/verify/' + receiver.token + '\r\n';
        text += 'Welcome to ' + frontend.url + '\r\n\r\n';
        text += 'If clicking does not work, try copy pasting the url above in browser\'s address bar.\r\n';
        text += 'If you did not register at ' + frontend.url + ' then ignore this mail. \r\n'

        var html = 'Hi ' + receiver.firstname + '! <br>';
        html += 'Please verify your email by clicking the following link: <br>';
        html += '<a href="' + frontend.url + '/verify/' + receiver.token + '">' + frontend.url + '/verify/' + receiver.token + '</a><br>';
        html += 'Welcome to ' + frontend.url + '<br><br>';
        html += 'If clicking does not work, try copy pasting the url above in browser\'s address bar.<br>';
        html += 'If you did not register at ' + frontend.url + ' then ignore this mail. <br>'

        mailOptions.text = text; 
        mailOptions.html = html; 
        mailOptions.to = receiver.email; 
        mailOptions.from = frontend.adminEmail; 
        //console.log(mailOptions);
        this.sendEmail(mailOptions, cb);

    }

};
