'use strict';

var users = require('./user').getUsers();
var sockets = [];

exports.setIo = function(io) {
  io.on('connection', function(socket) {
    sockets.push({
      s : socket
    });
    socket.on('disconnect', function() {
      sockets.splicePositiveIndex(sockets.indexOfObject('s', socket), 1);
    });
    socket.on('identify', function(d) {
      sockets[sockets.indexOfObject('s', socket)].username = d;
      sockets[sockets.indexOfObject('s', socket)].superAdmin = users[users.indexOfObject('username', d)].superAdmin;
    });
    socket.on('unidentify', function() {
      delete sockets[sockets.indexOfObject('s', socket)].username;
      delete sockets[sockets.indexOfObject('s', socket)].superAdmin;
    });
  });
};

exports.broadcastUserChange = function(msg) {
  sockets.forEach(function(v) {
    if (!v.superAdmin)
      return;
    v.s.emit('user', msg);
  });
};

exports.broadcastSiteChange = function(msg) {
  sockets.forEach(function(v) {
    if (v.superAdmin) {
      return v.s.emit('site', msg);
    }
    if (msg.od && msg.od.admins.indexOf(v.username) >= 0) {
      return v.s.emit('site', msg);
    }
    if (msg.nd && msg.nd.admins.indexOf(v.username) >= 0) {
      return v.s.emit('site', msg);
    }
  });
};