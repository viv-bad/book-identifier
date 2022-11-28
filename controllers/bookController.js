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
    // let bookData; isbn json data
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

    // .then((result) =>
    //   res.status(200).json({
    //     status: "success",
    //     data: {
    //       result,
    //     },
    //   })
    // );

    // const capitalize = function (string) {
    //   string
    //     .toLowerCase()
    //     .split(" ")
    //     .map((word) =>
    //       console
    //         .log(word.charAt(0).toUpperCase() + word.substring(1))
    //         .join(" ")
    //     );
    // };

    const capitalize = (string) => {
      return string
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const bookInfo = bookData.records[Object.keys(bookData.records)[0]]; //index the object to get book data below the OLID link
    // console.log(bookInfo.data);

    const title = capitalize(bookInfo.data.title);
    const [{ name: authorName }] = bookInfo.data.authors;
    const [{ url: authorUrl }] = bookInfo.data.authors;
    // const publishedDate = Number(bookInfo.data.publish_date.split("-")[0]);
    const publishedDate = bookInfo.data.publish_date;
    const pages = bookInfo.data.number_of_pages;
    const [{ name: publishers }] = bookInfo.data.publishers;
    const bookUrl = bookInfo.data.url;
    // const bookIsbn = bookInfo.isbns[1];
    // const imageCover = book.

    // Book.updateMany({
    //   title: title,
    //   author: authorName,
    //   year: publishedDate,
    //   isbn: bookIsbn,
    // });

    const doc = await Book.findById(id);

    doc.title = title;
    doc.author = authorName;
    doc.year = publishedDate;
    doc.authorUrl = authorUrl;
    doc.bookUrl = bookUrl;
    // doc.isbn = bookIsbn;

    await doc.save();

    // Book.findOneAndUpdate({
    //   title: title,
    //   author: authorName,
    //   year: publishedDate,
    //   isbn: bookIsbn,
    // });
    // Book.updateOne({
    //   title: title,
    // });

    console.log(title);
    console.log(authorName);
    console.log(publishedDate);
    // console.log(bookIsbn);
    console.log(authorUrl);
    console.log(pages);
    console.log(publishers);
    console.log(bookUrl);

    // window.onload();
    // window.location.href = `http://localhost:3000/books/${id}`;
    // const items = bookData.items;
    // const [{ fromRecord }] = items;
    // console.log(fromRecord);

    // const bookOlid = fromRecord;

    // console.log(bookOlid);

    // const olidFetch = await fetch(`https://openlibrary.org${bookOlid}.json`, {
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((result) => (bookOlidData = result));

    // console.log(bookOlidData);
    // const [publishers] = bookOlidData.publishers;
    // console.log(publishers);
    // const datePublished = bookOlidData.publish_date;
    // console.log(datePublished);
    // // const [authorsLink] = bookOlidData.authors;
    // // console.log(authorsLink);
    // const title = bookOlidData.title;
    // console.log(title);

    // console.log(bookData.records);
    // const { "/books/OL7353617M": data } = bookData.records;
    // console.log(data);
    //Here we assign the bookLink to the bookId and enter the object data through there, but we need to change the hard coded link to a dynamic changing link that changes with the book mongoDB ID
    // console.log(bookOlid);
    // const olid = bookOlid.split("/")[2];
    // console.log(olid);
    // const { fromRecord } = bookData.records;
    // console.log(fromRecord);
    // console.log(bookData.records);
    // const { bookOlid: data } = bookData.records;
    // console.log(data);
    // const { bookLink: dataAll } = bookData.records;
    // const { bookLink: bookId } = bookData.records;
    // console.log(bookId);
    // const [olid] = bookId.olids;
    // console.log(olid);
    // const bookLink = bookData.records;
    // console.log(bookLink);
    // const { items } = bookLink;
    // console.log(items);
    // const { "/books/OL7353617M": bookId } = bookLink; //Here we assign the bookLink to the bookId and enter the object data through there, but we need to change the hard coded link to a dynamic changing link that changes with the book mongoDB ID
    // console.log(bookId);
    // const title = bookId.data.title;
    // const [{ name: authors }] = bookId.data.authors; //Here we destructure an array of objects
    // const [{ name }] = bookId.data.publishers; //Here we destructure an array of objects
    // const datePublished = bookId.data.publish_date;
    // const bookUrl = bookId.data.url;

    // console.log("Title:", title);
    // console.log("Authors:", authors);
    // console.log("Publishers:", name);
    // console.log("Publish date:", datePublished);
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

  // res.status(200).json({
  //   status: "Book sucessfully created",
  //   data: book,
  // });
  // let id
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
    // .then((result) => res.redirect(`/books/info/${id}`))
    // .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));

  // console.log(id)

  // book
  //   .save()
  //   .then((result) => (id = result._id))
  //   .catch((err) => console.log(err));

  // console.log(id);
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

const book_edit = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.render("/books/edit", { book: book });

    console.log(req.body);
    if (!book) {
      res.status(404).json({ status: "Book not found!" });
    }
    res.status(200).json({
      status: "Book details successfully updated.",
      data: {
        data: book,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

// const book_info = async (req, res) => {
//   console.log(req.params.id);

//   // const info = await fetch(
//   //   `http://openlibrary.org/api/volumes/brief/isbn/${req.params.isbn}.json`,
//   //   {
//   //     headers: {
//   //       Accept: "application/json",
//   //       "Content-Type": "application/json",
//   //     },
//   //   }
//   // ).then((res) => console.log(res));

//   // console.log(info);

//   // const cover = await fetch(
//   //   `https://covers.openlibrary.org/b/isbn/${req.body.isbn}-L.jpg`,
//   //   {
//   //     headers: {
//   //       Accept: "application/json",
//   //       "Content-Type": "application/json",
//   //     },
//   //   }
//   // )
//   //   .then((res) => (book.imageCover = res.url))
//   //   .then(book.save())
//   //   .catch((err) => console.log(err)); //HERE res.url gives the API link to the cover page now we need to integrate it into img in HTML

//   // book
//   //   .save()
//   //   .then((result) => res.redirect("/"))
//   //   .catch((err) => console.log(err));
// };

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
