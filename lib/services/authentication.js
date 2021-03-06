'use strict';

var passport = require('passport');
var User = require('./user').User;
var fs = require('fs');
var path = require('path');
var sysFn = path.normalize(__dirname + '../../../data/system.json');
var authSchems = JSON.parse(fs.readFileSync(sysFn).toString()).authenticationSchemes;

if (authSchems.indexOfObject('type', 'basic') >= 0) {
  var BasicStrategy = require('passport-http').BasicStrategy;
  passport.use(new BasicStrategy(function(username, password, done) {
    User.findOne(username, function(err, user) {
      if (!user) {
        return done(null, false, {
          message : 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message : 'Incorrect password.'
        });
      }
      user.authMethod = 'basic';
      return done(null, user);
    });
  }));
}

if (authSchems.indexOfObject('type', 'SSO') >= 0) {
  var ReverseProxyStrategy = require('passport-reverseproxy');
  var headerOpts = {};
  headerOpts[authSchems[authSchems.indexOfObject('type', 'SSO')].userHeader] = {
    required : true
  };

  passport.use(new ReverseProxyStrategy({
    headers : headerOpts
  }, function(headers, userHeaderObj, done) {
    User.findOne(userHeaderObj.remote_user, function(err, user) {
      if (!user) {
        return done(null, false, {
          message : 'Incorrect username.'
        });
      }
      user.authMethod = 'sso';
      return done(null, user);
    });
  }));
}

passport.authenticationChain = authSchems.filter(function(v) {
  return v.type != 'form';
}).map(function(v, i) {
  switch (v.type) {
  case 'SSO':
    return function(req, res, next) {
      if (req.user)
        return next();
      passport.authenticate('reverseproxy', function(err, user, info) {
        if (user)
          req.logIn(user, function(er) {
            return next(er);
          });
        if (i == (authSchems.length - 1)) {
          // last in the chain and failed authentication.
          return res.send(401);
        } else {
          return next(err);
        }
        ;
      })(req, res, next);
    };
    break;
  case 'basic':
    return passport.authenticate('basic');
    break;
  }
});

passport.serializeUser(function(user, done) {
  done(null, user.authMethod + ";" + user.username);
});

passport.deserializeUser(function(id, done) {
  User.findOne(id.substr(id.indexOf(';') + 1), function(err, user) {
    user.authMethod = id.substr(0, id.indexOf(";"));
    done(err, user);
  });
});

module.exports = passport;