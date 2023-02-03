// set routes here, with the callback functions within each route being the controller/handler functions in bookController
// REMEMBER: The order of routing matters here!!!

const express = require("express");
const router = express.Router();
const bookController = require("./../controllers/bookController");

///////////GET REQUESTS///////////////

router.get("/", bookController.book_index);
router.get("/create", bookController.book_create_get, bookController.book_info);

////POST REQUEST  directly from webform to database//////////
router.post("/", bookController.book_create_post, bookController.book_info);

////////// GET BY ID ///////////////////////////
router.get("/:id", bookController.book_details);
router.get("/info/:id", bookController.book_info);

//////DELETE BY ID /////////
router.delete("/:id", bookController.book_delete);
router.post("/edit/:id", bookController.book_edit);

module.exports = router;
