'use strict';

var fs = require('fs');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/users.json');
var users;
try {
  users = JSON.parse(fs.readFileSync(fn).toString());
} catch (err) {
  users = [];
}

// used internally; not accessible via req
exports.getUsers = function() {
  return users;
};

exports.createUser = function(d) {
  users.push(d);
  fs.writeFileSync(fn, JSON.stringify(users, null, 2));
  return d;
};

exports.updateUser = function(userId, d) {
  users = users.map(function(v) {
    return v.username == userId ? d : v;
  });
  fs.writeFileSync(fn, JSON.stringify(users, null, 2));
};

exports.deleteUser = function(userIdx) {
  users.splicePositiveIndex(userIdx, 1);
  fs.writeFileSync(fn, JSON.stringify(users, null, 2));
};
