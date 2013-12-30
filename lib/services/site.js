'use strict';

var Site = require('../daos/site');

exports.deleteSite = function(siteId, byUser, noPersist) {
  if (!byUser)
    throw 'unauthorized';
  var siteIdx;
  Site.getSitesObj().some(function(v, i) {
    if (v.id == siteId) {
      siteIdx = i;
    }
    return v.id == siteId;
  });
  if (siteIdx == undefined)
    throw 'not found';
  if (!byUser.superAdmin && Site.getSitesObj()[siteIdx].admins.indexOf(byUser.username) < 0)
    throw 'unauthorized';
  var rmi = require('../daos/site').deleteSite(siteIdx, noPersist);
  require('./socket').broadcastSiteChange({
    t : 'delete',
    od : rmi[0]
  });
};

exports.createSite = function(site, noPersist) {
  require('../daos/site').createSite(site, noPersist);
  require('./socket').broadcastSiteChange({
    t : 'create',
    nd : site
  });
  return site;
};

exports.updateSite = function(siteId, site, byUser, noPersist) {
  Site.getSitesObj().some(function(v, i) {
    if (v.id == siteId) {
      if (!byUser.superAdmin && v.admins.indexOf(byUser.username) < 0)
        throw 'unauthorized';
      require('../daos/site').updateSite(i, site, noPersist);
      require('./socket').broadcastSiteChange({
        t : 'update',
        od : v,
        nd : site
      });
      return true;
    }
    return false;
  });
};
