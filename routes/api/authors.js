let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Author = require("../../models").author;
const createError = require("http-errors");

router.get("/", asyncMiddleware( async (req, res) => {
  const authors = await Author.findAll();
  res.json(authors);
}));

router.get("/:id", asyncMiddleware(async (req, res) => {
  const author = await Author.findOne({
    where: {
      id: req.params.id
    }
  });
  if(!author) throw createError(404);
  res.json(author);
}));

router.post("/", asyncMiddleware( async (req, res) => {
  const newAuthor = await Author.create(req.body);
  res.json(newAuthor);
}));

module.exports = router;