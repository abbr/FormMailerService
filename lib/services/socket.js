'use strict';

var users = require('./user').getUsers();

Array.prototype.indexOfObject = function(property, value) {
  for ( var i = 0, len = this.length; i < len; i++) {
    if (this[i][property] === value)
      return i;
  }
  return -1;
};

Array.prototype.splicePositiveIndex = function() {
  if (arguments[0] < 0)
    return null;
  return Array.prototype.splice.apply(this, arguments);
};

exports.setIo = function(io) {
  var sockets = [];
  io.on('connection', function(socket) {
    sockets.push({
      s : socket
    });
    socket.on('disconnect', function() {
      sockets.splicePositiveIndex(sockets.indexOfObject('s', socket), 1);
    });
    socket.on('identify', function(d) {
      sockets[sockets.indexOfObject('s', socket)].un = d;
      sockets[sockets.indexOfObject('s', socket)].superAdmin = users[users.indexOfObject('username',d)].superAdmin;
    });
    socket.on('unidentify', function() {
      delete sockets[sockets.indexOfObject('s', socket)].un;
      delete sockets[sockets.indexOfObject('s', socket)].superAdmin;
    });
  });
};
