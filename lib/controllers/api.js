'use strict';

var fs = require('fs');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/sites.json');
exports.getSites = function(req, res) {
  res.json(JSON.parse(fs.readFileSync(fn).toString()));
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
