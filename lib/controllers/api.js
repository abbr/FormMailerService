'use strict';

var fs = require('fs');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/sites.json');
exports.getSites = function(req, res) {
  fs.readFile(fn, function(err, data) {
    if (err)
      throw err;
    res.json(JSON.parse(data.toString()));
  });
};

exports.deleteSite = function(req, res) {
  var reqUrlPA = req.url.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  var d = JSON.parse(fs.readFileSync(fn).toString());
  var r = d.filter(function(v, i, a) {
    return v.id != siteId;
  });
  fs.writeFileSync(fn, JSON.stringify(r, null, 2));
};

exports.createSite = function(req, res) {
  var d = JSON.parse(fs.readFileSync(fn).toString());
  var uuid = require('node-uuid').v4();
  req.body.id = uuid;
  d.push(req.body);
  fs.writeFileSync(fn, JSON.stringify(d, null, 2));
  res.json(req.body);
}

exports.updateSite = function(req, res) {
  var reqUrlPA = req.url.split('/');
  var siteId = reqUrlPA[reqUrlPA.length - 1];
  var d = JSON.parse(fs.readFileSync(fn).toString());
  var r = d.map(function(v, i, a) {
    if (v.id == siteId) {
      return req.body;
    }
    return v;
  });
  fs.writeFileSync(fn, JSON.stringify(r, null, 2));
};
