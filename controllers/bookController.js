const fetch = require("node-fetch");
const Book = require("../models/bookModel");
const capitalize = require("../functions/capitalize");
const yearify = require("../functions/yearify");
// book_index (all books), book_details (single book), book_create_get , book_create_post, book_delete

////////////////////// Get all books ////////////////////////////
const book_index = (req, res) => {
  Book.find()
    .sort({ createdAt: -1 }) //allows sorting by most recent at top
    .then((result) => {
      res.render(
        "books/index", //render the index view
        { title: "All Books", books: result } //set books variable to the result. this books variable is now accessible in the index view
        // to view json in postman, uncomment below
        // (err, html) => res.send({ result })
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
////////////////////// Get individual book details ////////////////////////////
const book_details = async (req, res) => {
  const id = req.params.id; //set id variable to the individual book id (id from database)
  if (!id) return; //guard clause

  await Book.findById(id)
    .then((result) => {
      res.render(
        "books/details", //render details view page and inject book data in to be used by the view file
        { book: result, title: "Book Details" }
      );
    })
    .catch((err) => {
      //   res.render("404", { title: "Book not found" });
      console.log(err);
    });
};

const book_create_get = (req, res) => {
  res.render("books/create", { title: "Add new book" });
};

////////////////////// Create new book ////////////////////////////
const book_create_post = async (req, res) => {
  // console.log(req.body);
  if (!req.body.isbn) {
    //guard clause if no isbn entered
    res.status(400).send({ message: "You must enter an ISBN number!" });
    return null;
  }

  const book = new Book(req.body); //initialise new Book object based on Book schema
  let id = String(book._id); //set the id variable to the individual book id, need to use string to convert from ObjectId to just Id
  let url = `/books/info/${id}`;

  // Fetch image cover from OpenLibrary API
  const cover = await fetch(
    `https://covers.openlibrary.org/b/isbn/${req.body.isbn}-L.jpg`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => (book.imageCover = res.url))
    // .then(book.save())
    .catch((err) => console.log(err)); //HERE res.url gives the API link to the cover page now we need to integrate it into img in HTML

  //save the cover image in the database
  book
    .save()
    .then(function (result) {
      let id = String(result._id);
      let url = `/books/info/${id}`;
      // console.log(url);
      res.redirect(url); //redirect to the newly created book url (details page of new book)
    })
    .catch((err) => console.log(err));
};

////////////////////// Fetch book data ////////////////////////////
const book_info = async (req, res) => {
  try {
    const id = req.params.id;
    let url;
    const isbn = await Book.findById(id).then((result) => result.isbn.trim()); //get the isbn of the book in question

    url = `https://openlibrary.org/api/volumes/brief/isbn/${isbn}.json`; //inject the isbn into the url template literal to fetch data from the API

    const json = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      // parse the data with res.json
      .then((res) => res.json())
      // then return another promise as the data
      .then((result) => (bookData = result)) //set the result to bookData variable
      .then(res.redirect(`/books/${id}`)); //redirect back to the individual book url

    // bookData returns a nested records object within an object within which the data of interest exists- destructure this as below:
    const bookInfo = bookData.records[Object.keys(bookData.records)[0]];

    //pull out and assign relevant data to variables
    const title = capitalize(bookInfo.data.title);
    const [{ name: authorName }] = bookInfo.data.authors;
    const [{ url: authorUrl }] = bookInfo.data.authors;
    const publishedDate = yearify(bookInfo.data.publish_date);
    const pages = bookInfo.data.number_of_pages;
    const [{ name: publishers }] = bookInfo.data.publishers;
    const bookUrl = bookInfo.data.url;
    const imageCovers = bookInfo.data.cover.large;

    // Get genre of book from the array:
    let subjects;

    const genres = bookInfo.data.subjects.forEach(function (genre) {
      if (!genre) {
        return;
      } else {
        subjects = genre.name;
      }
    });

    // update the book with the data as found above
    await Book.findByIdAndUpdate(
      id,
      {
        title: title,
        author: authorName,
        year: publishedDate,
        authorUrl: authorUrl,
        bookUrl: bookUrl,
        subjects: subjects,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const book_delete = (req, res) => {
  const id = req.params.id;

  Book.findByIdAndDelete(id)
    .then((result) => {
      res.json({
        redirect: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const book_edit = async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = req.body;

    const bookUpdate = await Book.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        subjects: req.body.subjects,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .then(res.redirect(`/books/${id}`))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

//export all controller functions to be accessible in bookRoutes
module.exports = {
  book_index,
  book_details,
  book_create_post,
  book_create_get,
  book_delete,
  book_edit,
  book_info,
};
