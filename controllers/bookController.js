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
    let data;
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
      .then((result) =>
        res.status(200).json({
          status: "success",
          data: {
            result,
          },
        })
      );

    console.log(data);
    // console.log(info);
    console.log(url);
    console.log(isbn);
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
