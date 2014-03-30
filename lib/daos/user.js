'use strict';

var fs = require('fs');
var passwordHash = require('password-hash');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/users.json');
var sysFn = path.normalize(__dirname + '../../../data/system.json');
var repo = JSON.parse(fs.readFileSync(sysFn).toString()).repository;
var host_pid = require('os').hostname() + '_' + process.pid;
var users, mongoose;
try {
  switch (repo.type) {
  case "file":
    users = JSON.parse(fs.readFileSync(fn).toString());
    break;
  case "mongodb":
    mongoose = require('mongoose');
    var db = mongoose.connection;
    if (db.readyState === 0) {
      mongoose.connect(repo.connection_string, repo.connection_options || {});
    }
    mongoose.model('User', new mongoose.Schema({}, {
      strict : false
    })).find().select('-_id -__v').lean().exec(function(err, res) {
      users = res;
      if (users.length === 0) {
        exports.createUser({
          username : 'admin',
          password : 'admin',
          superAdmin : true
        });
      }
    });
    break;
  }
} catch (err) {
  users = [];
}

while(users === undefined){
	require('deasync').sleep(100);
}
// used internally; not accessible via req
exports.getUsers = function() {
  return users;
};

exports.createUser = function(d, noPersist) {
  d.password = passwordHash.generate(d.password);
  users.push(d);

  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(users, null, 2));
    break;
  case "mongodb":
    noPersist || mongoose.model('User').create(d, function(err, res) {
      mongoose.model('Journal').create({
        'host_pid' : host_pid,
        'entity' : 'user',
        'operation' : 'create',
        'doc' : res.toJSON()
      });
    });
    break;
  }
  return d;
};

exports.updateUser = function(userId, d, noPersist) {
  if (d.password) {
    d.password = passwordHash.generate(d.password);
  }
  users = users.map(function(v) {
    return v.username != userId ? v : require('util')._extend(require('util')._extend({}, v), d);
  });
  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(users, null, 2));
    break;
  case "mongodb":
    noPersist || mongoose.model('User').findOneAndUpdate({
      username : userId
    }, d, function(err, res) {
      mongoose.model('Journal').create({
        'host_pid' : host_pid,
        'entity' : 'user',
        'operation' : 'update',
        'oldId' : userId,
        'doc' : res.toJSON()
      });
    });
    break;
  }
};

exports.deleteUser = function(userIdx, noPersist) {
  var u = users.splicePositiveIndex(userIdx, 1);
  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(users, null, 2));
    break;
  case "mongodb":
    noPersist || mongoose.model('User').findOneAndRemove({
      username : u[0].username
    }, function(err, res) {
      mongoose.model('Journal').create({
        'host_pid' : host_pid,
        'entity' : 'user',
        'operation' : 'delete',
        'doc' : res.toJSON()
      });
    });
    break;
  }
};
