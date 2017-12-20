const { auth, book } = require('../services');
const { ServerError } = require('../helpers/server');
const { requireAuthentication, isBookAlreadyExist, isBookAlreadyRequest } = auth;

function searchBooks(email, password,keyword) {
  requireAuthentication(email, password);
  return book.searchBookInGoogle(keyword);
}

async function addBook(email,password,bookObj) {
  requireAuthentication(email, password);
  try {
	  await isBookAlreadyExist(bookObj.id, bookObj.ownerId); 
  	return book.createBook(bookObj);
  } catch (error) {
    throw new ServerError(error.message, error.status);
  }
}

function getAllBook(keyword) {
  return book.getBooks(null,keyword);
}

function getCounts(email, password, userId) {
  requireAuthentication(email, password);
	return book.getCounts(userId);
}

function getBookById(email, password, ownerId) {
  requireAuthentication(email, password);
  return book.getBooks(ownerId,null);
}

function getWishList(email, password, reqId) {
  requireAuthentication(email, password);
  return book.getWishListBook(reqId);
}

function getRequiredList(email, password, ownerId) {
  requireAuthentication(email, password);
  return book.getRequiredList(ownerId);
}

function getGivenList(email, password, ownerId) {
  requireAuthentication(email, password);
  return book.getGivenList(ownerId);
}

function getReceiveList(email, password, ownerId) {
  requireAuthentication(email, password);
  return book.getReceiveList(ownerId);
}

async function requestBook(email, password, body) {
  requireAuthentication(email, password);
  try {
    await isBookAlreadyRequest(body.id, body.requestedId); 
    return book.addToWishList(body);
  } catch (error) {
    throw new ServerError(error.message, error.status);
  }
}

function rejectRequestBook(email, password, body) {
  requireAuthentication(email, password);
  return book.rejectRequestBook(body);
}

function confirmRequestBook(email, password, body) {
  requireAuthentication(email, password);
  return book.confirmRequestBook(body);
}

function removeOwnBook(email, password, body) {
  requireAuthentication(email, password);
  return book.removeYourBook(body);
}

function removeFromWishList(email, password, body) {
	requireAuthentication(email, password);
	return book.removeFromWishList(body);
}

module.exports = {
  searchBooks,
  addBook,
  getAllBook,
  getCounts,
  getBookById,
  getWishList,
  getRequiredList,
  getGivenList,
  getReceiveList,
  requestBook,
  rejectRequestBook,
  confirmRequestBook,
  removeOwnBook,
  removeFromWishList,
};
