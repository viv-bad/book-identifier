const fetch = require("node-fetch");
const Book = require("./../bookModel");
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

  Book.findById(id)
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
      .then((result) =>
        res.status(200).json({
          status: "success",
          data: {
            result,
          },
        })
      );

    const items = bookData.items;
    const [{ fromRecord }] = items;
    console.log(fromRecord);

    const bookOlid = fromRecord;

    const olidFetch = await fetch(`https://openlibrary.org${bookOlid}.json`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => (bookOlidData = result));

    console.log(bookOlidData);
    const [publishers] = bookOlidData.publishers;
    console.log(publishers);
    const datePublished = bookOlidData.publish_date;
    console.log(datePublished);
    const [authorsLink] = bookOlidData.authors;
    console.log(authorsLink);
    const title = bookOlidData.title;
    console.log(title);

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

  book
    .save()
    .then((result) => res.redirect("/"))
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
