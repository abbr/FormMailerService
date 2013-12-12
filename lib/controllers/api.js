'use strict';
exports.getSites = function(req, res) {
  if (!req.user)
    return res.send(401);
  var sites = require('../services/site').getSitesObj();
  res.json(req.user.superAdmin ? sites : sites.filter(function(v) {
    return v.admins.indexOf(req.user.username) >= 0;
  }));
};

exports.deleteSite = function(req, res) {
  if (!req.user)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
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
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  require('../services/site').updateSite(siteId, req.body, req.user);
  res.send(200);
};

exports.getUsers = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  res.json(require('../services/user').getUsers());
};

exports.createUser = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  res.json(require('../services/user').createUser(req.body));
};

exports.updateUser = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var userId = reqUrlPA[reqUrlPA.length - 1];
  res.json(require('../services/user').updateUser(userId, req.body));
};

exports.deleteUser = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var userId = reqUrlPA[reqUrlPA.length - 1];
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
  delete x.password;
  res.json(x);
};
