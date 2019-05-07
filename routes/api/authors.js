let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Author = require("../../models").author;

router.get("/", asyncMiddleware( async (req, res, next) => {
  const authors = await Author.findAll();
  res.json(authors);
}));

router.post("/", asyncMiddleware( async (req, res, next) => {
  const newAuthor = await Author.create(req.body);
  res.json(newAuthor);
}));

module.exports = router;