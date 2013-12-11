'use strict';

var fs = require('fs');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/sites.json');
var sites;
try {
  sites = JSON.parse(fs.readFileSync(fn).toString());
} catch (err) {
  sites = [];
}

// used internally; not accessible via req
exports.getSitesObj = function() {
  return sites;
};

exports.getSites = function(req, res) {
  if (!req.user)
    return res.send(401);
  res.json(req.user.superAdmin ? sites : sites.filter(function(v) {
    return v.admins.indexOf(req.user.username) >= 0;
  }));
};

exports.deleteSite = function(req, res) {
  if (!req.user)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  var siteIdx;
  sites.some(function(v, i, a) {
    if (v.id == siteId) {
      siteIdx = i;
    }
    return v.id == siteId;
  });
  if (siteIdx == undefined)
    return res.send(404);
  if (!req.user.superAdmin && sites[siteIdx].admins.indexOf(req.user.username) < 0)
    return res.send(401);
  sites.splice(siteIdx, 1);
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
  res.send(200);
};

exports.createSite = function(req, res) {
  if (!req.user)
    return res.send(401);
  var uuid = require('node-uuid').v4();
  req.body.id = uuid;
  sites.push(req.body);
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
  res.json(req.body);
};

exports.updateSite = function(req, res) {
  if (!req.user)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  sites = sites.map(function(v, i, a) {
    if (v.id == siteId) {
      return req.body;
    }
    return v;
  });
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
  res.send(200);
};

exports.getUsers = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  res.json(require('./user').getUsers());
};

exports.createUser = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  res.json(require('./user').createUser(req.body));
};

exports.updateUser = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var userId = reqUrlPA[reqUrlPA.length - 1];
  res.json(require('./user').updateUser(userId, req.body));
};

exports.deleteUser = function(req, res) {
  if (!req.user || !req.user.superAdmin)
    return res.send(401);
  var reqUrlPA = req.path.split('/');
  var userId = reqUrlPA[reqUrlPA.length - 1];
  try {
    require('./user').deleteUser(userId);
    res.send(200);
  } catch (err) {
    res.send(404);
  }

};

exports.isSuperAdmin = function(req, res) {
  if (!req.user)
    return res.send(401);
  res.json([ req.user.superAdmin ]);
};
