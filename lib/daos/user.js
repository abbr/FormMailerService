'use strict';

var fs = require('fs');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/users.json');
var sysFn = path.normalize(__dirname + '../../../data/system.json');
var repo = JSON.parse(fs.readFileSync(sysFn).toString()).repository;
var users, mongoose, usersCB = [];
try {
  switch (repo.type) {
  case "file":
    users = JSON.parse(fs.readFileSync(fn).toString());
    usersCB.forEach(function(cb) {
      cb(null, users);
    });
    usersCB = [];

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
      usersCB.forEach(function(cb) {
        cb(null, users);
      });
      usersCB = [];
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
  usersCB.forEach(function(cb) {
    cb(null, users);
  });
  usersCB = [];
}

exports.getUsersAsync = function(cb) {
  if (users) {
    return cb(null, users);

  }
  usersCB.push(cb);

}
// used internally; not accessible via req
exports.getUsers = function() {
  return users;
};

exports.createUser = function(d) {
  users.push(d);

  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(users, null, 2));
    break;
  case "mongodb":
    mongoose.model('User').create(d);
    break;
  }
  return d;
};

exports.updateUser = function(userId, d) {
  users = users.map(function(v) {
    return v.username == userId ? d : v;
  });

  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(users, null, 2));
    break;
  case "mongodb":
    mongoose.model('User').update({
      username : userId
    }, d).exec();
    break;
  }
};

exports.deleteUser = function(userIdx) {
  var u = users.splicePositiveIndex(userIdx, 1);
  switch (repo.type) {
  case "file":
    fs.writeFileSync(fn, JSON.stringify(users, null, 2));
    break;
  case "mongodb":
    mongoose.model('User').remove({
      username : u[0].username
    }).exec();
    break;
  }
};
