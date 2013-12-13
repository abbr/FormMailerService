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
  require('./socket').broadcastUserChange({
    t : 'create',
    nd : d
  });
  return d;
};

exports.updateUser = function(userId, d) {
  users = users.map(function(v) {
    if (v.username == userId) {
      if (!v.superAdmin && d.username != userId) {
        // non-superadmin's name has changed; update all sites
        require('./site').getSitesObj().forEach(function(sv) {
          if (sv.admins.indexOf(v.username) < 0)
            return;
          if (d.superAdmin)
            sv.admins.splicePositiveIndex(sv.admins.indexOf(v.username), 1);
          else
            sv.admins.splicePositiveIndex(sv.admins.indexOf(v.username), 1, d.username);
          require('./site').updateSite(sv.id, sv, {
            superAdmin : true
          });
        });
      }
      require('./socket').broadcastUserChange({
        t : 'update',
        od : v,
        nd : d
      });
      return d;
    }
    return v;
  });
  fs.writeFileSync(fn, JSON.stringify(users, null, 2));
};

exports.deleteUser = function(userId) {
  var userIdx;
  users.some(function(v, i) {
    if (v.username == userId) {
      userIdx = i;
      // update site.admins
      if (!v.superAdmin) {
        require('./site').getSitesObj().forEach(function(sv) {
          if (sv.admins.indexOf(v.username) < 0)
            return;
          sv.admins.splicePositiveIndex(sv.admins.indexOf(v.username), 1);
          require('./site').updateSite(sv.id, sv, {
            superAdmin : true
          });
        });
      }
      require('./socket').broadcastUserChange({
        t : 'delete',
        od : v
      });
    }
    return v.username == userId;
  });
  if (userIdx == undefined)
    throw "Invalid username";
  users.splicePositiveIndex(userIdx, 1);
  fs.writeFileSync(fn, JSON.stringify(users, null, 2));
};
