const { auth, book } = require('../services');
const { ServerError } = require('../helpers/server');
const { createBook,searchBookInGoogle,getBooks,removeYourBook } = book;
const { requireAuthentication, isBookAlreadyExist } = auth;

function searchBooks(keyword) {
  return searchBookInGoogle(keyword);
}

async function addBook(email,password,book) {
  requireAuthentication(email, password);
  try {
	  await isBookAlreadyExist(book.id, book.ownerId); 
  	return createBook(book);
  } catch (error) {
    throw new ServerError(error.message, error.status);
  }
}

function getAllBook() {
	return getBooks();
}

function getBookById(email, password, ownerId) {
  requireAuthentication(email, password);
  return getBooks(ownerId);
}

function removeOwnBook(email, password, body) {
	requireAuthentication(email, password);
	return removeYourBook(body);
}

module.exports = {
  searchBooks,
  addBook,
  getAllBook,
  getBookById,
  removeOwnBook
};
