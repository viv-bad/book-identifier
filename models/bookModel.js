///////////// Set schema here////////////////////

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  year: {
    type: String,
  },
  isbn: {
    type: String,
    // required: true,
  },
  imageCover: {
    type: String,
  },
  imageCovers: {
    type: String,
  },
  //could also use mongoose timestamps
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  authorUrl: {
    type: String,
  },
  bookUrl: {
    type: String,
  },
  subjects: {
    type: String,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
