'use strict';

var path = require('path');

exports.partials = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if (err) {
      res.render('404');
    } else {
      res.send(html);
    }
  });
};

exports.index = function(req, res) {
  res.render('index');
};

exports.sendMail = function(req, res) {
  var nodemailer = require("nodemailer");

  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP", {
    host : "foo.com",
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from : "nobody@foo.com", // sender address
    to : "nobody@foo.com", // list of receivers
    subject : "Hello ✔", // Subject line
    text : "Hello world ✔", // plaintext body
    html : "<b>Hello world ✔</b>" // html body
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
      res.render('index');
    }

    // if you don't want to use this transport object anymore, uncomment
    // following line
    // smtpTransport.close(); // shut down the connection pool, no more messages
  });
};
