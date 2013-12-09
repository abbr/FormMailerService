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

exports.getSitesObj = function() {
  return sites;
};

exports.getSites = function(req, res) {
  res.json(sites);
};

exports.deleteSite = function(req, res) {
  var reqUrlPA = req.path.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  sites = sites.filter(function(v, i, a) {
    return v.id != siteId;
  });
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
};

exports.createSite = function(req, res) {
  var uuid = require('node-uuid').v4();
  req.body.id = uuid;
  sites.push(req.body);
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
  res.json(req.body);
};

exports.updateSite = function(req, res) {
  var reqUrlPA = req.path.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  sites = sites.map(function(v, i, a) {
    if (v.id == siteId) {
      return req.body;
    }
    return v;
  });
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
};
