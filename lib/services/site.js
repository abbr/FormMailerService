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

exports.deleteSite = function(siteId, byUser) {
  if (!byUser)
    throw 'unauthorized';
  var siteIdx;
  sites.some(function(v, i) {
    if (v.id == siteId) {
      siteIdx = i;
    }
    return v.id == siteId;
  });
  if (siteIdx == undefined)
    throw 'not found';
  if (!byUser.superAdmin && sites[siteIdx].admins.indexOf(byUser.username) < 0)
    throw 'unauthorized';
  var rmi = sites.splice(siteIdx, 1);
  require('./socket').broadcastSiteChange({
    t : 'delete',
    od : rmi[0]
  });

  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
};

exports.createSite = function(site) {
  var uuid = require('node-uuid').v4();
  site.id = uuid;
  sites.push(site);
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
  require('./socket').broadcastSiteChange({
    t : 'create',
    nd : site
  });
  return site;
};

exports.updateSite = function(siteId, site, byUser) {
  sites = sites.map(function(v) {
    if (v.id == siteId) {
      if (!byUser.superAdmin && v.admins.indexOf(byUser.username) < 0)
        throw 'unauthorized';
      require('./socket').broadcastSiteChange({
        t : 'update',
        od : v,
        nd : site
      });
      return site;
    }
    return v;
  });
  fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
};