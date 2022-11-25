const express = require("express");
const bookController = require("./../controllers/bookController");
const router = express.Router();

router.get("/create", bookController.book_create_get);
router.get("/", bookController.book_index);
////POST REQUEST  directly from webform to database//////////
router.post("/", bookController.book_create_post);
router.get("/:id", bookController.book_details);
router.get("info/:id", bookController.book_info);
//////DELETE/////////
router.delete("/:id", bookController.book_delete);
router.patch("/edit/:id", bookController.book_edit);

module.exports = router;