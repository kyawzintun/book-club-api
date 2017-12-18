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

router.put('/update-user-info/:userId', c(auth.updateUserInfo, req => [req.headers.email, req.headers.password,req.params.userId, req.body]));

/**
 * Book.
 */
router.get('/get-books', c(book.getAllBook, req => [req.query.keyword]));
router.get('/get-counts/:userId', c(book.getCounts, req => [req.headers.email, req.headers.password,req.params.userId]));
router.get('/get-books/:ownerId', c(book.getBookById, req => [req.headers.email, req.headers.password,req.params.ownerId]));
router.get('/search-books', c(book.searchBooks, req => [req.headers.email, req.headers.password,req.query.keyword]));
router.get('/wish-list/:reqId', c(book.getWishList, req => [req.headers.email, req.headers.password, req.params.reqId]));
router.get('/required-list/:ownerId', c(book.getRequiredList, req => [req.headers.email, req.headers.password, req.params.ownerId]));
router.get('/given-list/:ownerId', c(book.getGivenList, req => [req.headers.email, req.headers.password, req.params.ownerId]));
router.get('/receive-list/:ownerId', c(book.getReceiveList, req => [req.headers.email, req.headers.password, req.params.ownerId]));

router.post('/add-book/', c(book.addBook, req => [req.headers.email, req.headers.password, req.body]));

router.put('/request-book/', c(book.requestBook, req => [req.headers.email, req.headers.password, req.body]));
router.put('/remove-from-wishlist/', c(book.removeFromWishList, req => [req.headers.email, req.headers.password, req.body]));
router.put('/reject-request/', c(book.rejectRequestBook, req => [req.headers.email, req.headers.password, req.body]));
router.put('/confirm-request/', c(book.confirmRequestBook, req => [req.headers.email, req.headers.password, req.body]));

router.delete('/remove-book/', c(book.removeOwnBook, req => [req.headers.email, req.headers.password, req.body]));

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
