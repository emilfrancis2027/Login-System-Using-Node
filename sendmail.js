const SGmail = require('@sendgrid/mail')
SGmail.setApikey("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");
const msg = {
     to: 'emil.francis2027@gmail.com',
     from: 'emil.francis2021@gmail.com',
     subject: 'Sending with Twilio SendGrid is Fun',
     text: 'and easy to do anywhere, even with Node.js',
     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
   };
  sgMail.send(msg);