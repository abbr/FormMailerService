'use strict';
exports.getSites = function(req, res) {
  if (!req.user)
    return res.send(401);
  var sites = require('../daos/site').getSitesObj();
  res.json(req.user.superAdmin ? sites : sites.filter(function(v) {
    return v.admins.indexOf(req.user.username) >= 0;
  }));
};

exports.deleteSite = function(req, res) {
  if (!req.user)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var siteId = decodeURIComponent(reqUrlPA[reqUrlPA.length - 1]);
  try {
    require('../services/site').deleteSite(siteId, req.user);
  } catch (err) {
    switch (err.toString()) {
      case "unauthorized":
        return res.send(401);
        break;
      case "not found":
        return res.send(404);
        break;
    }
  }
  res.send(200);
};

exports.createSite = function(req, res) {
  if (!req.user)
    return res.send(401);
  res.json(require('../services/site').createSite(req.body));
};

exports.updateSite = function(req, res) {
  if (!req.user)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var siteId = decodeURIComponent(reqUrlPA[reqUrlPA.length - 1]);
  require('../services/site').updateSite(siteId, req.body, req.user);
  res.send(200);
};

exports.getUsers = function(req, res) {
  if (!req.user)
    return res.send(401);
  var us = require('../daos/user').getUsers();
  if (req.user.superAdmin)
    return res.json(us.map(function(v) {
      var temp = require('util')._extend({}, v);
      delete temp.password;
      return temp;
    }));
  return res.json(us.filter(function(v) {
    return !v.superAdmin;
  }).map(function(v) {
    return {
      username : v.username
    };
  }));
};

exports.createUser = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  try {
    res.json(require('../services/user').createUser(req.body));
  } catch (ex) {
    res.send(409, ex);
  }
};

exports.updateUser = function(req, res) {
  if (!req.user)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var userId = decodeURIComponent(reqUrlPA[reqUrlPA.length - 1]);
  if (!req.user.superAdmin) {
    if (userId !== req.user.username) {
      return res.send(401);
    } else {
      req.body.username = userId;
      req.body.superAdmin = false;
    }
  }
  res.json(require('../services/user').updateUser(userId, req.body));
  res.send(200);
};

exports.deleteUser = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var userId = decodeURIComponent(reqUrlPA[reqUrlPA.length - 1]);
  try {
    require('../services/user').deleteUser(userId);
    res.send(200);
  } catch (err) {
    res.send(404);
  }

};

exports.getCurrentUser = function(req, res) {
  if (!req.user)
    return res.send(404);
  var x = JSON.parse(JSON.stringify(Object.getPrototypeOf(req.user)));
  x.authMethod = req.user.authMethod;
  delete x.password;
  res.json(x);
};

exports.login = function(req, res) {
  require('../services/user').User.findOne(req.body.username, function(err, user) {
    if (!user) {
      return res.send(401);
    }
    if (!user.validPassword(req.body.password)) {
      return res.send(401);
    }
    if (req.body.remember) {
      // 30 days
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.maxAge = false;
    }
    user.authMethod = 'form';
    req.logIn(user, function(er) {
      if (er)
        return res.send(500);
      exports.getCurrentUser(req, res);
    });
  });
};
