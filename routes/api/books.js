let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Book = require("../../models").book;
const Author = require("../../models").author;
const Theme = require("../../models").theme;
const Genre = require("../../models").genre;
const Op = require("../../models").Sequelize.Op;

router.get("/", asyncMiddleware( async (req, res, next) => {
  const books = await Book.findAll();
  res.json(books);
}));

router.post("/", asyncMiddleware( async (req, res, next) => {
  const authors = await Author.findAll({where: {
      id: {[Op.or]: req.body.authors}
    }});
  if(!authors.length===req.body.authors.length) return next("Author not found");
  const newBook = await Book.create(req.body);
  await newBook.setAuthors(authors);
  const {genres, themes} = req.body;
  if(genres){
    genres.forEach((name) => {
      Genre.findOrCreate({where: {name}}).then(g => {
        newBook.addGenre(g[0]).catch(console.error);
      });
    });
  }
  if(themes){
    themes.forEach((name) => {
      Theme.findOrCreate({where: {name}}).then(t => {
        newBook.addTheme(t[0]).catch(console.error);
      });
    });
  }
  res.json(newBook);
}));

module.exports = router;