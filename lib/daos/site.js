'use strict';

var fs = require('fs');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/sites.json');
var sysFn = path.normalize(__dirname + '../../../data/system.json');
var repo = JSON.parse(fs.readFileSync(sysFn).toString()).repository;
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

exports.deleteSite = function(siteIdx) {
  var rmi = sites.splice(siteIdx, 1);
  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
    break;
  case "mongodb":
    mongoose.model('Site').remove({
      id : rmi[0].id
    }).exec();
    break;
  }
  return rmi;
};

exports.createSite = function(site) {
  var uuid = require('node-uuid').v4();
  site.id = uuid;
  sites.push(site);
  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
    break;
  case "mongodb":
    mongoose.model('Site').create(site);
    break;
  }
  return site;
};

exports.updateSite = function(siteIdx, site) {
  var rmi = sites.splice(siteIdx, 1, site);
  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(sites, null, 2));
    break;
  case "mongodb":
    mongoose.model('Site').update({
      id : rmi[0].id
    }, site).exec();
    break;
  }
};
