'use strict';

var fs = require('fs');
var path = require('path');
var sysFn = path.normalize(__dirname + '../../../data/system.json');
var sysConfig;
var siteFn = path.normalize(__dirname + '../../../data/sites.json');

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
  sysConfig = sysConfig || JSON.parse(fs.readFileSync(sysFn).toString());
  var reqUrlPA = req.path.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  fs.readFile(siteFn, function(err, data) {
    if (err)
      res.send(500);
    var sites = JSON.parse(data.toString());
    var siteObj;
    sites.some(function(v) {
      if (siteId == v.id) {
        siteObj = v;
        return true;
      }
      return false;
    });
    if (!siteObj) {
      res.send(500);
      return;
    }
    
    // validate referrer
    var ref = req.get('referrer');
    if (!ref) {
      res.send(401);
      return;
    } else {
      ref = ref.toLowerCase();
    }
    var refMatches = siteObj.referrers.some(function(v) {
      return ref.substr(ref.indexOf('//') + 2).search(v.toLowerCase()) == 0;
    });
    if (!refMatches) {
      res.send(401);
      return;
    }

    // parse form data
    var txtBody = '', htmlBody = '<table border="1"><tr><th>Field</th><th>Value</th></tr>';
    for ( var p in req.query) {
      if (!req.query.hasOwnProperty(p))
        continue;
      txtBody += p + ': ' + req.query[p] + '\n';
      htmlBody += '<tr><td>' + p + '</td><td>' + req.query[p] + '</td></tr>';
    }
    for ( var p in req.body) {
      if (!req.body.hasOwnProperty(p))
        continue;
      txtBody += p + ': ' + req.body[p] + '\n';
      htmlBody += '<tr><td>' + p + '</td><td>' + req.body[p] + '</td></tr>';
    }
    var nodemailer = require("nodemailer");
    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP", {
      host : sysConfig.SMPT_HOST,
    });
    htmlBody += "</table>";

    var mailOptions = {
      from : siteObj.mailFrom, // sender address
      to : siteObj.mailTo.join(';'), // list of receivers
      subject : siteObj.mailSubject, // Subject line
      text : txtBody,
      html : siteObj.isHtml ? htmlBody : undefined
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response) {
      if (error) {
        res.send(500);
      } else {
        console.log("Message sent: " + response.message);
        res.send(200);
      }

      // if you don't want to use this transport object anymore,
      // uncomment
      // following line
      // smtpTransport.close(); // shut down the connection pool, no
      // more
      // messages
    });
  });
};
