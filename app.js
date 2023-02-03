const path = require("path");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/bookRoutes");
const dotenv = require("dotenv");
// require("ejs");
//Express app
const express = require("express");
const app = express();

//register view engine
app.set("view engine", "ejs");
// app.set("views", "books");
dotenv.config({ path: "./config.env" });

const { response } = require("express");
const { render } = require("ejs");

//////////////////////Set up the server/db here/////////////////////////////////

const dbURI = `mongodb+srv://vbadiani:${process.env.PWORD}@cluster0.0voqkux.mongodb.net/bookstore-1?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3000);
    console.log(
      `Connected to Database and listening to port: ${process.env.PORT}`
    );
  });

//////////////MIDDLEWARE///////////////

// set view engine and directory here
app.set("views", __dirname + "/views");
// set public folder path here to access static files
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true })); //needed for req.body to work (accepting form data)
app.use(express.json()); //THIS IS NEEDED TO PARSE DATA TO JSON FOR PATCH ETC!!!

//////////////////////////ROUTES///////////////////////////

//Home page redirect
app.get("/", (req, res) => {
  res.redirect("/books");
});

//book routes
app.use("/books", bookRoutes);

//404 error route
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
