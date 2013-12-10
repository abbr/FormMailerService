'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path');

var app = express();


var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy
, User = require('./lib/controllers/user').User;
passport.use(new LocalStrategy(
function(username, password, done) {
  User.findOne(username, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  User.findOne(id, function(err, user) {
    done(err, user);
  });
});

// Express Configuration
app.configure('development', function(){
  app.use(require('connect-livereload')());
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
  app.set('views', __dirname + '/app/views');
});

app.configure('production', function(){
  app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', __dirname + '/views');
});

app.configure(function(){
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
  app.use(express.session({ secret: 'ffoisaiods984' }));
  app.use(passport.initialize());
  app.use(passport.session());
	app.use(express.methodOverride());

  // Router needs to be last
	app.use(app.router);
});

// Controllers
var api = require('./lib/controllers/api'),
    controllers = require('./lib/controllers');

// Server Routes
app.get('/api/sites*', api.getSites);
app.delete('/api/sites/*', api.deleteSite);
app.put('/api/sites/*', api.updateSite);
app.post('/api/sites/?', api.createSite);
app.get('/logout*', function(req, res){
  req.logout();
  res.redirect('/');
});

// Angular Routes
app.get('/partials/*', controllers.partials);
// form posting
app.all('/site/*', controllers.sendMail);
app.get('/*', controllers.index);
app.post('/?',
    passport.authenticate('local', { successRedirect: '/admin',
                                     failureRedirect: '/',
                                     failureFlash: false })
  );

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});