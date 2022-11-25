const mongoose = require("mongoose");
// const slugify = require("slugify");
// const validator = require("validator");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
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
