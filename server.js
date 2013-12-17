'use strict';

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

// Module dependencies.
var express = require('express'), path = require('path');

var app = express();
var server = require('http').createServer(app);
require('./lib/services/socket').setIo(require('socket.io').listen(server));

var passport = require('./lib/services/authentication');

// Express Configuration
app.configure('development', function() {
  app.use(require('connect-livereload')());
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
  app.set('views', __dirname + '/app/views');
});

app.configure('production', function() {
  app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', __dirname + '/views');
});

app.configure(function() {
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({
    secret : 'ffoisaiods984'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  // prevent IE caching
  app.use(function(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next();
  });
  // Router needs to be last
  app.use(app.router);
});

// Controllers
var api = require('./lib/controllers/api'), controllers = require('./lib/controllers');

// Server Routes
app.get('/api/sites*', api.getSites);
app.delete('/api/sites/*', api.deleteSite);
app.put('/api/sites/*', api.updateSite);
app.post('/api/sites/?', api.createSite);
app.get('/api/users*', api.getUsers);
app.delete('/api/users/*', api.deleteUser);
app.put('/api/users/*', api.updateUser);
app.post('/api/users/?', api.createUser);
app.get('/api/cu*', api.getCurrentUser);
app.get('/logout*', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Angular Routes
app.get('/partials/*', controllers.partials);
// form posting
app.all('/site/*', controllers.sendMail);
app.all('/login', controllers.index);
app.all('/*', passport.authenticationChain, controllers.index);
// Start server
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});
