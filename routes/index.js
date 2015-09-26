var express = require('express');
var router = express.Router();

// needed to parse contact form body request
var bodyParser = require('body-parser');

// used for url request to google's recaptcha api
var https = require('https');

// used to send contact form email
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Rich Freeman Portfolio' });
});

/* GET about */
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About'} );
});

/* GET projects */
router.get('/projects', function(req, res, next) {
    res.render('projects', { title: 'Projects'} );
});

/* GET services */
router.get('/services', function(req, res, next) {
    res.render('services', { title: 'Services'} );
});

/* GET contact */
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact'} );
});

/* POST contact */
router.post('/contact', function(req, res, next) {
    
    // check recaptcha first
    verifyRecaptcha(req.body['g-recaptcha-response'], function(success) {
        if (success) {
            
            // send email
            var message = '<h4>Portfolio Contact Request<h4><p>Name: ' + req.body.name + '</p><p>Email: ' + req.body.email + '</p><p>Phone: ' + req.body.phone + '</p><p>Message: ' + req.body.message + '</p>';
            
            var mailOptions = {
                from: 'gcevstation@gmail.com',
                to: 'rich@infrontofthenet.com',
                subject: 'Portfolio Contact Request',
                html: message
            }
            
            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    res.end('Could not send ' + err.toString());
                }
                else {
                    // show thank you
                    res.render('thankyou', { title: 'Thanks!}' });
                }
            });
                  
        }
        else {
            res.end('You don\'t look human to me.  Try again.');
        }
    });
    

});

// recaptcha secret key
var SECRET = '6Lf0lw0TAAAAADik_AI4DvuSkcyJLl-aEQ9a3ZBL';

// helper function to call recaptcha API and parse response from Google - courtesy Jonathan Warner @jaxbot
function verifyRecaptcha(key, callback) {
    https.get('https://www.google.com/recaptcha/api/siteverify?secret=' + SECRET + '&response=' + key, function(res) {
        
        var data = '';
        
        res.on('data', function(chunk) {
            data += chunk.toString();
        });
        
        res.on('end', function() {
           try {
               var parsedData = JSON.parse(data);
               callback(parsedData.success);
           } 
            catch(e) {
                callback(false);
            }
        });
    });
}

// mail transporter
/*var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'gcevstation@gmail.com',
        pass: '8x8F?C54'
    }
});*/

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail.knowleswoolsey.com',
    port: 25,
    auth: {
        user: 'contact@knowleswoolsey.com',
        pass: 'sellcondos1'
    }
}));

module.exports = router;
