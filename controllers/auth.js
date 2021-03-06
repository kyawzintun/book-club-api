const passport = require('passport');
const { auth, user } = require('../services');
const { ServerError } = require('../helpers/server');
require('../helpers/passport-strategies');

function signin(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local-signin', (error, user, info) => {
      if (error) {
        return reject(error); // Passport uses callback, but controllerHandler uses Promise.
      }
      if (!user) {
        return reject(new ServerError(info, 400));
      }
      
      return req.logIn(user, (loginError) => {
        if (loginError) {
          return reject(loginError);
        }
        return resolve(user);
      });
    })(req, res, next);
  });
}

function signup(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local-signup', (error, user, info) => {
      if (error) {
        return reject(error); // Passport uses callback, but controllerHandler uses Promise.
      }
      if (!user) {
        return reject(new ServerError(info, 400));
      }

      return resolve(user);
    })(req, res, next);
  });
}

function updateUserInfo(email, password,userId, body) {
  auth.requireAuthentication(email, password)
  return user.updateUserInfo(userId, body);
}

module.exports = {
  signin,
  signup,
  updateUserInfo
};
