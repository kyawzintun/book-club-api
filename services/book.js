const { ServerError } = require('../helpers/server');
const request = require('request');
const Book = require('../models/Book');

async function createBook(book) {
  const newBook = new Book(book);
  try {
    await newBook.validate();
    return newBook.save();
  } catch (validateError) {
    throw new ServerError(validateError.message, 400);
  }
}

async function getBooks(){
  const book = await Book.find({}).exec();
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
  getBooks
};
