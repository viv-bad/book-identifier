const mongoose = require("mongoose");
const bookController = require("./../controllers/bookController");
// const slugify = require("slugify");
// const validator = require("validator");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    // default: bookController.book_info.title,
  },
  author: {
    type: String,
  },
  year: {
    type: Number,
  },
  isbn: {
    type: Number,
    required: true,
  },
  imageCover: {
    type: String,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  // _id: { type: String, required: true },
});
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
