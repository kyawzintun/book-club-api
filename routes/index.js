const express = require('express');
const controllers = require('../controllers');
const router = express.Router();
const {
  auth,
  book,
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
 * Book.
 */
router.get('/get-books', c(book.getAllBook, req => [req.headers.email, req.headers.password]));
router.get('/search-books', c(book.searchBooks, req => [req.query.keyword]));
router.post('/add-book/', c(book.addBook, req => [req.headers.email, req.headers.password, req.body]));

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
