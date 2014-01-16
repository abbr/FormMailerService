'use strict';

var User = require('../daos/user');
var passwordHash = require('password-hash');

exports.User = {
  "findOne" : function(un, cb) {
    if (!User.getUsers().some(function(v) {
      if (v.username == un) {
        var uo = Object.create(v);
        uo.validPassword = function(p) {
          return passwordHash.isHashed(v.password) ? passwordHash.verify(p, v.password) : (p == v.password);
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

exports.createUser = function(d, noPersist) {
  if (User.getUsers().indexOfObject('username', d.username) >= 0) {
    throw 'duplicated user';
  }
  d = require('../daos/user').createUser(d, noPersist);
  var temp = require('util')._extend({}, d);
  delete temp.password;
  require('./socket').broadcastUserChange({
    t : 'create',
    nd : temp
  });
  return temp;
};

exports.updateUser = function(userId, d, noPersist) {
  User.getUsers().some(function(v) {
    if (v.username == userId) {
      if (!v.superAdmin && d.username != userId) {
        // non-superadmin's name has changed; update all sites
        require('../daos/site').getSitesObj().forEach(function(sv) {
          if (sv.admins.indexOf(v.username) < 0)
            return;
          if (d.superAdmin)
            sv.admins.splicePositiveIndex(sv.admins.indexOf(v.username), 1);
          else
            sv.admins.splicePositiveIndex(sv.admins.indexOf(v.username), 1, d.username);
          require('./site').updateSite(sv.id, sv, {
            superAdmin : true
          }, noPersist);
        });
      }
      var temp1 = require('util')._extend({}, v);
      delete temp1.password;
      var temp2 = require('util')._extend({}, d);
      delete temp2.password;
      if (!require('underscore').isEqual(temp1, temp2)) {
        require('./socket').broadcastUserChange({
          t : 'update',
          od : temp1,
          nd : temp2
        });
      }
      return true;
    }
    return false;
  });
  require('../daos/user').updateUser(userId, d, noPersist);
};

exports.deleteUser = function(userId, noPersist) {
  var userIdx;
  User.getUsers().some(function(v, i) {
    if (v.username == userId) {
      userIdx = i;
      // update site.admins
      if (!v.superAdmin) {
        require('../daos/site').getSitesObj().forEach(function(sv) {
          if (sv.admins.indexOf(v.username) < 0)
            return;
          sv.admins.splicePositiveIndex(sv.admins.indexOf(v.username), 1);
          require('./site').updateSite(sv.id, sv, {
            superAdmin : true
          }, noPersist);
        });
      }
      var temp = require('util')._extend({}, v);
      delete temp.password;
      require('./socket').broadcastUserChange({
        t : 'delete',
        od : temp
      });
    }
    return v.username == userId;
  });
  if (userIdx == undefined)
    throw "Invalid username";
  require('../daos/user').deleteUser(userIdx, noPersist);
};
