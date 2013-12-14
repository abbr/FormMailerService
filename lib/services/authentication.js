var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy
, User = require('./user').User;
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

module.exports = passport;