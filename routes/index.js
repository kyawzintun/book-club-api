const express = require('express');
const controllers = require('../controllers');
const router = express.Router();
const {
  auth,
  home,
} = controllers;

const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams);
    return res.json(result || { message: 'OK' });
  } catch (error) {
    return res.status(500) && next(error);
  }
};
const c = controllerHandler;

/**
 * Auth.
 */
router.post('/signin', c(auth.signin, (req, res, next) => [req, res, next]));
router.post('/signup', c(auth.signup, (req, res, next) => [req, res, next]));

/**
 * Home.
 */
router.get('/', c(home.hello));
router.get('/greet/:name', c(home.getGreeting, req => [req.params.name]));
router.post('/greet/', c(home.postGreeting, req => [req.body.name]));

/**
 * Error-handler.
 */
router.use((err, req, res, _next) => {
  console.log('error ', err);
  if (err.status) {
    return res.status(err.status || 500).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Internal Server Error.' });
});

module.exports = router;
