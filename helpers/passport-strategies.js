const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt   = require('bcrypt');

const { User } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Local.
 */
passport.use('local-signin', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return done(null, false, 'Email not found.');
    }

    bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) throw err;

        if (!isMatch) {
          return done(null, false, 'Incorrect password.');
        }

        return done(null, user);
    });
  
  } catch (error) {
    return done(error);
  }
}));

passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
  const user = await User.findOne({ email }).exec();
  if (user) {
    return done(null, false, 'This email is already exist.Try another.');
  }

  const newUser = new User();
  newUser.email = email;
  newUser.password = password;
  newUser.username = req.body.username;
  newUser.address = req.body.address;

  try {
    const newUserSaved = await newUser.save();
    return done(null, newUserSaved);
  } catch (error) {
    return done(error);
  }
}));

module.export = passport;
