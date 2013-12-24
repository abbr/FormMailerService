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

exports.deleteSite = function(siteIdx) {
  var rmi = sites.splice(siteIdx, 1);
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
  return rmi;
};

exports.createSite = function(site) {
  var uuid = require('node-uuid').v4();
  site.id = uuid;
  sites.push(site);
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
  return site;
};

exports.updateSite = function(siteIdx, site) {
  sites.splice(siteIdx, 1, site);
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
};
