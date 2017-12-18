const { ServerError } = require('../helpers/server');
const { Book } = require('../models/Book');

function requireAuthentication(user, password) {
  if (!user || !password) {
    throw new ServerError('Authentication is required.', 403);
  }
  return user;
}

async function isBookAlreadyExist(bookId, ownerId) {
  const book = await Book.findOne({"id":bookId, "ownerId": ownerId}).exec();
  if (book) {
    throw new ServerError('This book is already exist in your book list.Try another.', 409);
  }
  return book;
}

module.exports = {
  requireAuthentication,
  isBookAlreadyExist
};
