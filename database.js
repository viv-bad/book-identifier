// const mongoose = require("mongoose");
// const Book = require("./bookModel");
// const server = require("./server");

// mongoose.connect(
//   "mongodb://localhost/bookstore",
//   () => {
//     console.log("Connected");
//   },
//   (error) => console.log(error)
// );

// run();
// async function run() {
//   try {
//     const user = await Book.create({
//       name: "The Lone Wolf",
//       author: "James Joyce",
//       year: 1954,
//       createdAt: Date.now(),
//     });
//     await user.save();
//     //   const user = new User({ name: "Vivek", age: 27 });
//     //   await user.save();
//     // console.log(user);
//   } catch (err) {
//     console.log(err);
//   }
// }

// const port = process.env.port || 3000;
// const server = server.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });
