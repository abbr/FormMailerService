'use strict';

var fs = require('fs');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/sites.json');
var sysFn = path.normalize(__dirname + '../../../data/system.json');
var repo = JSON.parse(fs.readFileSync(sysFn).toString()).repository;
var host_pid = require('os').hostname() + '_' + process.pid;
var sites, mongoose, sitesCB = [];
try {
  switch (repo.type) {
    case "file":
      sites = JSON.parse(fs.readFileSync(fn).toString());
      sitesCB.forEach(function(cb) {
        cb(null, sites);
      });
      sitesCB = [];
      break;
    case "mongodb":
      mongoose = require('mongoose');
      var db = mongoose.connection;
      if (db.readyState === 0) {
        mongoose.connect(repo.connection_string, repo.connection_options || {});
      }
      mongoose.model('Site', new mongoose.Schema({}, {
        strict : false,
        id : false
      })).find().select('-_id -__v').lean().exec(function(err, res) {
        sites = res;
        sitesCB.forEach(function(cb) {
          cb(null, sites);
        });
        sitesCB = [];
      });
      break;
  }
} catch (err) {
  sites = [];
  sitesCB.forEach(function(cb) {
    cb(null, sites);
  });
  sitesCB = [];
}

exports.getSitesAsync = function(cb) {
  if (sites) {
    return cb(null, sites);

  }
  sitesCB.push(cb);
};

exports.getSitesObj = function() {
  return sites;
};

exports.deleteSite = function(siteIdx, noPersist) {
  var rmi = sites.splice(siteIdx, 1);
  switch (repo.type) {
    case "file":
      fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
      break;
    case "mongodb":
      noPersist || mongoose.model('Site').findOneAndRemove({
        id : rmi[0].id
      }, function(err, res) {
        mongoose.model('Journal').create({
          'host_pid' : host_pid,
          'entity' : 'site',
          'operation' : 'delete',
          'doc' : res.toJSON()
        });
      });
      break;
  }
  return rmi;
};

exports.createSite = function(site, noPersist) {
  var uuid = require('node-uuid').v4();
  site.id = uuid;
  sites.push(site);
  switch (repo.type) {
    case "file":
      fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
      break;
    case "mongodb":
      noPersist || mongoose.model('Site').create(site, function(err, res) {
        mongoose.model('Journal').create({
          'host_pid' : host_pid,
          'entity' : 'site',
          'operation' : 'create',
          'doc' : res.toJSON()
        });
      });
      break;
  }
  return site;
};

exports.updateSite = function(siteIdx, site, noPersist) {
  var rmi = sites.splice(siteIdx, 1, site);
  switch (repo.type) {
    case "file":
      fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
      break;
    case "mongodb":
      noPersist || mongoose.model('Site').findOneAndUpdate({
        id : rmi[0].id
      }, site, function(err, res) {
        mongoose.model('Journal').create({
          'host_pid' : host_pid,
          'entity' : 'site',
          'operation' : 'update',
          'doc' : res.toJSON()
        });
      });
      break;
  }
};
