var nodeMailer = require('nodemailer');
var logger = require('../log4js');

exports.sendMail = function(mailOptions) {
    try {
        logger.log('in mailer ' + mailOptions)
        var transporter = nodeMailer.createTransport({
            host: 'smtp.office365.com',
            //port: 465,
            port: 587,
            secure: false, //true for 465 port, false for other ports
            auth: {
                user: 'info@getajobng.com',
                pass: '@!2345GetAXLeasE##'
            }
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.log('mail not sent - ' + error);
            } else {
                logger.log('mail sent');
            }
        });
    } catch (error) {
        logger.log(error);
    }
}