let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const allowPosts = require("../../middlewares/allowPosts");
const Author = require("../../models").author;
const Book = require("../../models").book;
const createError = require("http-errors");

router.get("/", asyncMiddleware( async (req, res) => {
  const authors = await Author.findAll();
  res.json(authors);
}));

router.get("/:id", asyncMiddleware(async (req, res) => {
  const id= req.params.id;
  if(isNaN(id)) throw createError(400, "Author id must be an integer");
  const author = await Author.findOne({
    where: {
      id
    },
    include: [{
      model: Book,
      through: {
        attributes: []
      }
    }]
  });
  if(!author) throw createError(404);
  res.json(author);
}));

router.post("/", allowPosts, asyncMiddleware( async (req, res) => {
  const newAuthor = await Author.create(req.body);
  res.json(newAuthor);
}));

module.exports = router;