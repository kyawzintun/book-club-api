const { auth, book } = require('../services');
const { ServerError } = require('../helpers/server');
const { requireAuthentication, isBookAlreadyExist } = auth;

function searchBooks(keyword) {
  return book.searchBookInGoogle(keyword);
}

async function addBook(email,password,book) {
  requireAuthentication(email, password);
  try {
	  await isBookAlreadyExist(book.id, book.ownerId); 
  	return book.createBook(book);
  } catch (error) {
    throw new ServerError(error.message, error.status);
  }
}

function getAllBook() {
	return book.getBooks();
}

function getBookById(email, password, ownerId) {
  requireAuthentication(email, password);
  return book.getBooks(ownerId);
}

function removeOwnBook(email, password, body) {
  requireAuthentication(email, password);
  return book.removeYourBook(body);
}

function requestBook(email, password, body) {
  requireAuthentication(email, password);
  return book.addToWishList(body);
}

function getWishList(email, password, reqId) {
  requireAuthentication(email, password);
  return book.getWishListBook(reqId);
}

function removeFromWishList(email, password, body) {
	requireAuthentication(email, password);
	return book.removeFromWishList(body);
}

module.exports = {
  searchBooks,
  addBook,
  getAllBook,
  getBookById,
  removeOwnBook,
  requestBook,
  getWishList,
  removeFromWishList
};
