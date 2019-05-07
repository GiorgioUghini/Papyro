let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Book = require("../../models").book;

router.get("/", asyncMiddleware( async (req, res, next) => {
  const books = await Book.findAll();
  res.json(books);
}));

router.post("/", asyncMiddleware( async (req, res, next) => {
  const newBook = await Book.create(req.body);
  res.json(newBook);
}));

module.exports = router;