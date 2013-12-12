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

exports.User = {
  "findOne" : function(un, cb) {
    if (!users.some(function(v) {
      if (v.username == un) {
        var uo = Object.create(v);
        uo.validPassword = function(p) {
          return p == v.password;
        };
        cb(null, uo);
        return true;
      }
      return false;
    })) {
      return cb("Invalid user", false);
    }
  }
};

exports.createUser = function(d) {
  users.push(d);
  fs.writeFileSync(fn, JSON.stringify(users, null, 2));
  return d;
};

exports.updateUser = function(userId, d) {
  users = users.map(function(v) {
    if (v.username == userId) {
      if(!v.superAdmin && d.username != userId){
        // non-superadmin's name has changed; update all sites
        
      }
      return d;
    }
    return v;
  });
  fs.writeFileSync(fn, JSON.stringify(users, null, 2));
  res.send(200);

};

exports.deleteUser = function(userId) {
  var userIdx;
  users.some(function(v, i, a) {
    if (v.username == userId) {
      userIdx = i;
    }
    return v.username == userId;
  });
  if (userIdx == undefined)
    throw "Invalid username";
  users.splice(userIdx, 1);
  fs.writeFileSync(fn, JSON.stringify(users, null, 2));
};
