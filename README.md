# Book Identifier Application

---

We all struggle with accruing many books over the course of our lifetimes. If you are like me, you also struggle to remember what books you even have on your bookshelf, leading to books you were once excited to read, fall by the wayside. Now a simple book identifier, where you can input your book details manually is one step forward into truly knowing what is on your bookshelf. However, manually inputting hundreds of entries is completely time consuming. Not to mention if you wanted to also add the book cover to the directory.
Well, this book identifier solves both of these problems by automating the entering of all of your book details in one click!

## Features

This project has the following features:

1. A homepage index directory of all books you currently own and that have been added via the identifier.

   ![homepage-before](docs/../public/img/docs/homepage.png)

2. An 'Add book' route, which takes you to a page with one sole input: the ISBN number. This ISBN number acts as the unique identifier for the book in question.

   ![add-book](/public/img/docs/add-book.png)

3. By inputting the ISBN number of a book, the application will make a call to the OpenLibrary API, where it will return first the book cover of the book in question.

   ![check-book](public/img/docs/check-book.png)

4. If the book identifier is correct, you can then click the 'info' button below the cover, which will then make a second call to the OpenLibrary API, this time grabbing the rest of the book information including the title, author, year, publisher and genre of the book. Otherwise, you can delete the book if the book cover is incorrect. You can also click on the title or the author, which links you to the openlibrary webpage for that book or author in question for more information, or for similar books.

   ![get-info](public/img/docs/add-info.png)

5. Then, as you navigate back to the 'all books' index directory, you will see your book entry added to the directory.

   ![homepage-after](public/img/docs/homepage-2.png)
