const { auth, book } = require('../services');
const { ServerError } = require('../helpers/server');
const { createBook,searchBookInGoogle } = book;
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
    throw new ServerError('Internal Server Error', 500);
  }
}

module.exports = {
  searchBooks,
  addBook,
};