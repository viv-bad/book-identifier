const fetch = require("node-fetch");
const Book = require("../models/bookModel");
// book_index (all books), book_details (single book), book_create_get , book_create_post, book_delete

const book_index = (req, res) => {
  // let data;
  Book.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      // data = result;
      res.render("books/index", { title: "All Books", books: result });
    })
    .catch((error) => {
      console.log(error);
    });

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     data: data,
  //   },
  // });
};

const book_details = async (req, res) => {
  const id = req.params.id;
  if (!id) return;

  await Book.findById(id)
    .then((result) => {
      res.render("books/details", { book: result, title: "Book Details" });
    })

    // Book.findById(id)
    //   .then((result) => {
    //     res.status(200).json({ status: "success", data: { result } });
    //   })

    .catch((err) => {
      //   res.render("404", { title: "Book not found" });
      console.log(err);
    });
};

const book_info = async (req, res) => {
  try {
    const id = req.params.id;
    let url;
    let bookOlidData;
    const isbn = await Book.findById(id).then((result) => result.isbn);

    const info = await fetch(
      `https://openlibrary.org/api/volumes/brief/isbn/${isbn}.json`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then((res) => (url = res.url));
    // .then((res) => console.log(res));
    // .then((result) =>
    //   res.status(200).json({
    //     status: "success",
    //     data: {
    //       result,
    //     },
    //   })
    // );

    const json = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => (bookData = result))
      .then(res.redirect(`/books/${id}`));

    const capitalize = (string) => {
      return string
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const yearify = (year) => {
      if (year.includes(",")) {
        return year.split(", ")[1];
      }
      if (year.includes("-")) {
        return year.split("-")[0];
      }
      if (
        year.startsWith("J") ||
        year.startsWith("F") ||
        year.startsWith("M") ||
        year.startsWith("A") ||
        year.startsWith("S") ||
        year.startsWith("O") ||
        year.startsWith("N") ||
        year.startsWith("D")
      ) {
        return year.split(" ")[1];
      } else {
        return year;
      }
    };

    const bookInfo = bookData.records[Object.keys(bookData.records)[0]]; //index the object to get book data below the OLID link
    // console.log(bookInfo.data);

    const title = capitalize(bookInfo.data.title);
    const [{ name: authorName }] = bookInfo.data.authors;
    const [{ url: authorUrl }] = bookInfo.data.authors;
    // const publishedDate = Number(bookInfo.data.publish_date.split("-")[0]);
    const publishedDate = yearify(bookInfo.data.publish_date);
    const pages = bookInfo.data.number_of_pages;
    const [{ name: publishers }] = bookInfo.data.publishers;
    const bookUrl = bookInfo.data.url;
    // const imageCovers = bookInfo.data.cover.large;
    let subjects;
    const genres = bookInfo.data.subjects.forEach(
      function (genre) {
        if (!genre) {
          return;
        } else {
          subjects = genre.name;
        }
      }
      // (genre) => (subjects = genre.name)
      // console.log(genre.name)
    );

    const doc = await Book.findById(id);

    doc.title = title;
    doc.author = authorName;
    doc.year = publishedDate;
    doc.authorUrl = authorUrl;
    doc.bookUrl = bookUrl;
    doc.subjects = subjects;
    // doc.imageCovers = imageCovers;
    // doc.isbn = bookIsbn;

    await doc.save();

    // console.log(subjects);
    // console.log(imageCovers);

    // console.log(title);
    // console.log(authorName);
    // console.log(publishedDate);
    // // console.log(bookIsbn);
    // console.log(authorUrl);
    // console.log(pages);
    // console.log(publishers);
    // console.log(bookUrl);
  } catch (err) {
    console.log(err);
  }
};

const book_create_get = (req, res) => {
  res.render("books/create", { title: "Add new book" });
};

const book_create_post = async (req, res) => {
  console.log(req.body);
  const book = new Book(req.body);
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
    .then(book.save())
    .catch((err) => console.log(err)); //HERE res.url gives the API link to the cover page now we need to integrate it into img in HTML

  book
    .save()
    .then(function (result) {
      let id = String(result._id);
      id = id.replace(/^\D+/g, "");
      console.log(id);
      let url = `/books/info/${id}`;
      console.log(url);
      res.redirect(url);
    })
    .catch((err) => console.log(err));
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
    console.log(req.body);
    const id = req.params.id;
    console.log(id);

    const bookUpdate = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // res.status(200).render("books/index.ejs", {
    //   title: "Book details updated",
    //   data: bookUpdate,
    // });
    // .then(res.json({ redirect: `/books/edit/${id}` }));

    // .then((result) => res.render("/books/edit", { book: book }));

    console.log(req.body);
    if (!bookUpdate) {
      res.status(404).json({ status: "Book not found!" });
    }
    res.status(200).json({
      status: "Book details successfully updated.",
      redirect: `/books/${id}`,
      data: {
        data: bookUpdate,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  book_index,
  book_details,
  book_create_post,
  // book_image_cover,
  book_create_get,
  book_delete,
  book_edit,
  book_info,
};
