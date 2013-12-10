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

exports.User = {
  "findOne" : function(un, cb) {
    if (!users.some(function(v) {
      if (v.username == un) {
        cb(null, {
          username : v.username,
          validPassword : function(p) {
            return p == v.password;
          }
        })
        return true;
      }
      return false;
    })) {
      return cb("Invalid user", false);
    }
  }
}