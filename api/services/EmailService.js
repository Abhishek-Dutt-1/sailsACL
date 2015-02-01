var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport( smtpTransport( sails.config.mandrill ) );

var server = {
    URL: 'http:/localhost:1337',
    senderEmail: 'abhishek.india@gmail.com'
};

module.exports = {

    sendEmail: function(mailOptions) {

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
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    },

    // send email verficatrion for new registered users.
    sendEmailVerificationEmail: function( receiver ) {

        var mailOptions = {
            from: 'abhishek.india@gmail.com', // sender address
            to: 'abhishek.india@gmail.com', // list of receivers
            subject: 'Hi! Verfiy your email.', // Subject line
            text: 'Hello world ✔', // plaintext body
            html: '<b>Hello world ✔</b>' // html body
        };
        
        var text = 'Hi ' + receiver.firstname + '! \r\n';
        text += 'Please verify your email by clicking the following link: \r\n';
        text += server.URL + '/verify/' + receiver.token + '\r\n';
        text += 'Welcome to ' + server.URL + '\r\n\r\n';
        text += 'If clicking does not work, try copy pasting the url above in browser\'s address bar.\r\n';
        text += 'If you did not register at ' + server.URL + ' then ignore this mail. \r\n'

        var html = 'Hi ' + receiver.firstname + '! <br>';
        html += 'Please verify your email by clicking the following link: <br>';
        html += '<a href="' + server.URL + '/verify/' + receiver.token + '">' + server.URL + '/verify/' + receiver.token + '</a><br>';
        html += 'Welcome to ' + server.URL + '<br><br>';
        html += 'If clicking does not work, try copy pasting the url above in browser\'s address bar.<br>';
        html += 'If you did not register at ' + server.URL + ' then ignore this mail. <br>'

        mailOptions.text = text; 
        mailOptions.html = html; 
        mailOptions.to = receiver.email; 
        mailOptions.from = server.senderEmail; 
        console.log(mailOptions);
        this.sendEmail(mailOptions);

    }

};
