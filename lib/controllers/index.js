'use strict';

var fs = require('fs');
var path = require('path');
var sysFn = path.normalize(__dirname + '../../../data/system.json');
var sysConfig;

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
  // CORS
  var oneof = false;
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if (req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if (req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', 31536000);
  }

  // intercept OPTIONS method
  if (oneof && req.method == 'OPTIONS') {
    return res.send(200);
  }

  sysConfig = sysConfig || JSON.parse(fs.readFileSync(sysFn).toString());
  var reqUrlPA = req.path.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  var sites = require('../services/site').getSitesObj();
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
  var refHost, refProtocol;
  var refMatches = siteObj.referrers.some(function(v) {
    if (ref.substr(ref.indexOf('//') + 2).search(v.toLowerCase()) == 0) {
      refProtocol = ref.substr(0, ref.indexOf(':'));
      refHost = v.toLowerCase();
      return true;
    }
    return false;
  });
  if (!refMatches) {
    res.send(401);
    return;
  }

  // reCAPTCHA validation
  if (siteObj.useReCaptcha && siteObj.reCaptchaPriKey) {
    if (!req.body['recaptcha_challenge_field'] || !req.body['recaptcha_response_field'])
      return siteObj.failurePage && res.redirect(refProtocol + "://" + refHost + siteObj.failurePage) || res.send(500);
    var reCapOptions = {
      hostname : 'www.google.com',
      port : 80,
      path : '/recaptcha/api/verify',
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    };

    var reCapReq = require('http').request(reCapOptions, function(reCapRes) {
      console.log('STATUS: ' + reCapRes.statusCode);
      console.log('HEADERS: ' + JSON.stringify(reCapRes.headers));
      reCapRes.setEncoding('utf8');
      reCapRes.on('data', function(chunk) {
        if (chunk.split('\n')[0] != 'true') {
          return failure('incorrect_recaptcha');
        } else {
          delete req.body['recaptcha_challenge_field'];
          delete req.body['recaptcha_response_field'];
          _sendMail();
        }
      });
    });
    reCapReq.on('error', function(e) {
      return failure('error_recaptcha');
    });
    var reCapReqStr = 'privatekey=' + encodeURIComponent(siteObj.reCaptchaPriKey);
    reCapReqStr += '&remoteip=' + encodeURIComponent(req.ip);
    reCapReqStr += '&challenge=' + encodeURIComponent(req.body['recaptcha_challenge_field']);
    reCapReqStr += '&response=' + encodeURIComponent(req.body['recaptcha_response_field']);
    reCapReq.write(reCapReqStr);
    reCapReq.end();
  } else {
    _sendMail();
  }

  function _sendMail() {
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
    var smtpTransport = nodemailer.createTransport("SMTP", sysConfig.SMTP);
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
      smtpTransport.close(); // shut down the connection pool
      if (error) {
        return failure('error_mail');
      } else {
        if (siteObj.successPage) {
          res.redirect(refProtocol + "://" + refHost + siteObj.successPage);
        } else
          res.send(200);
      }

    });
  }

  function failure(reason) {
    if (siteObj.failurePage)
      return res.redirect(refProtocol + "://" + refHost + siteObj.failurePage.replace('{reason}', encodeURIComponent(reason)));
    else
      return res.send(500, reason);
  }
};
