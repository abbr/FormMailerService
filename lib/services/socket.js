'use strict';

exports.setIo = function(io) {
  var sockets = [];
  io.on('connection', function(socket) {
    sockets.push(socket);
    socket.on('disconnect', function() {
      sockets.splice(sockets.indexOf(socket), 1);
    });
    socket.on('identify', function(d) {
      console.log(d);
    });
    socket.on('unidentify', function(d) {
      console.log('unidentify');
    });
  });
};
