const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  id: {type: String,required: true},
  ownerId: {type: String,required: true},
  originalOwnerId: {type: String,required: true},
  title: {type: String,required: true},
  subtitle: {type: String},
  authors: {type: String},
  categories: {type: String},
  description: {type: String},
  imageLink: {type: String},
  infoLink: {type: String},
  pageCount: {type: String},
  publishedDate: {type: String},
  requestedId: {type: String},
}, { timestamps: true });

const TradedBookSchema = new Schema({
  id: {type: String,required: true},
  ownerId: {type: String,required: true},
  originalOwnerId: {type: String,required: true},
  title: {type: String,required: true},
  subtitle: {type: String},
  authors: {type: String},
  categories: {type: String},
  description: {type: String},
  imageLink: {type: String},
  infoLink: {type: String},
  pageCount: {type: String},
  publishedDate: {type: String},
  requestedId: {type: String},
});

const Book = mongoose.model('Book', BookSchema);
const TradedBook = mongoose.model('TradedBook', TradedBookSchema);

module.exports = {
    Book: Book,
    TradedBook: TradedBook
}
