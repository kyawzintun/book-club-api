const { ServerError } = require('../helpers/server');
const request = require('request');
const { Book,TradedBook } = require('../models/Book');

async function createBook(book) {
  const newBook = new Book(book);
  try {
    await newBook.validate();
    return newBook.save();
  } catch (validateError) {
    throw new ServerError(validateError.message, 400);
  }
}

async function getBooks(ownerId, keyword){
  let book;
  if(ownerId) {
    book = await Book.find({"ownerId": ownerId}).exec();
  }else {
    if(keyword) {
      book = await Book.find({"title": { "$regex": keyword, "$options":"i" }, "requestedId":{$eq: null}}).exec();
    }else {
      book = await Book.find({"requestedId":{$eq: null}}).sort('-createdAt').exec();
    }
  }
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function getCounts(userId){
  const count = {
    "ownBookCount": await Book.find({"ownerId": userId}).count(),
    "wishListCount": await Book.find({"requestedId": userId}).count(),
    "requireCount": await Book.find({"ownerId": userId, "requestedId": {$ne: null}}).count(),
    "givenCount": await TradedBook.find({"originalOwnerId": userId}).count(),
    "receiveCount": await TradedBook.find({"ownerId": userId}).count(),
  }
  try {
    return count;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function getWishListBook(reqId){
  const  book = await Book.find({"requestedId": reqId}).exec();
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function getRequiredList(ownerId){
  const  book = await Book.find({"ownerId": ownerId, "requestedId": {$ne: null}}).exec();
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function getGivenList(ownerId){
  const  book = await TradedBook.find({"originalOwnerId": ownerId}).exec();
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function getReceiveList(ownerId){
  const  book = await TradedBook.find({"ownerId": ownerId}).exec();
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function addToWishList(body){
  const book = await Book.updateOne({"_id": body._id},{$set :{"requestedId": body.requestedId}});
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function rejectRequestBook(body){
  const book = await Book.updateOne({"id": body.id,"requestedId": body.reqId},{$set :{"requestedId": null}});
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function confirmRequestBook(body){
  const updatedBook = await Book.findOneAndUpdate({"id": body.id,"ownerId": body.ownerId,"requestedId": body.reqId},{$set :{"ownerId": body.reqId,"requestedId": null}},{new: true});
  const b = {
    "id": updatedBook.id,
    "title": updatedBook.title,
    "authors": updatedBook.authors,
    "categories": updatedBook.categories,
    "description": updatedBook.description,
    "imageLink": updatedBook.imageLink,
    "infoLink": updatedBook.infoLink,
    "pageCount": updatedBook.pageCount,
    "publishedDate": updatedBook.publishedDate,
    "ownerId": updatedBook.ownerId,
    "originalOwnerId": updatedBook.originalOwnerId,
    "requestedId": null
  };
  const book = await TradedBook.findOne({"id":b.id, "originalOwnerId": b.originalOwnerId}).exec();
  if (book) {
    throw new ServerError('This book is already exist in traded books logs.', 200);
  }
  const newTradedBook = new TradedBook(b);
  try {
    await newTradedBook.validate();
    return newTradedBook.save();
  } catch (validateError) {
    throw new ServerError(validateError.message, 400);
  }
}

async function removeYourBook(body){
  let book;
  if(body.ownerId && body.id) {
    book = await Book.deleteOne({"ownerId": body.ownerId, "id": body.id});
  }
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function removeFromWishList(body){
  const book = await Book.updateOne({"requestedId": body.reqId, "id": body.id},{$set :{"requestedId": null }});
  try {
    return book;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}

async function searchBookInGoogle(keyword) {
  if (!keyword) {
    throw new ServerError('Keyword can\'t be undefined', 400);
  }
  const books = await searchBook(keyword);
  return books;
}

function searchBook(keyword) {
	return new Promise(function(resolve, reject){
	 	const apiUrl = `https://www.googleapis.com/books/v1/volumes?maxResults=40&printType=books&q=${keyword}&key=AIzaSyDii-uTzizQmM5acMXOnYZ1uwEcdapNIm4`
	 	request(apiUrl, function (error, response, body) {
		  	if (!error) {
          const books = JSON.parse(body);
          const bookArr = [];
          if(books.totalItems){
            books.items.map((book, index) => {
              const bookInfo = book.volumeInfo;
              const bookObj = {
                "id": book.id,
                "title": bookInfo.title,
                "subtitle": bookInfo.subtitle,
                "authors": bookInfo.authors ? bookInfo.authors.join(', ') : '-',
                "categories": bookInfo.categories ? bookInfo.categories.join(', ') : '-',
                "description": bookInfo.description,
                "imageLink": bookInfo.hasOwnProperty('imageLinks') ? bookInfo.imageLinks.thumbnail.replace(/&zoom=1&edge=curl/, '') : null,
                "infoLink": bookInfo.infoLink,
                "pageCount": bookInfo.pageCount,
                "publishedDate": bookInfo.publishedDate,
              };
              bookArr.push(bookObj);
            });
            resolve(bookArr);
          }else {
            resolve(bookArr);
          }
		    } else {
		      	reject(error);
		    }
		});
	});
}

module.exports = {
  createBook,
  searchBookInGoogle,
  getBooks,
  getCounts,
  getWishListBook,
  getRequiredList,
  getGivenList,
  getReceiveList,
  addToWishList,
  rejectRequestBook,
  confirmRequestBook,
  removeYourBook,
  removeFromWishList
};
