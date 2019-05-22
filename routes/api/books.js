let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Book = require("../../models").book;
const Author = require("../../models").author;
const Theme = require("../../models").theme;
const Genre = require("../../models").genre;
const Reserve = require("../../models").reserve;
const Op = require("../../models").Sequelize.Op;
const Sequelize = require("../../models").Sequelize;
const {mapToArray} = require("../../utils");

/**
 * @typedef Book
 * @property {integer} id
 * @property {string} title.required
 * @property {string} picture - URL to the book's picture
 * @property {string} abstract - short description of the book
 * @property {string} interview - interview with the author
 * @property {object} facts - an object with different facts about the book
 * @property {boolean} isFavorite - indicates whether this book is one of our favourite
 */

/**
 * Get all books
 * @route GET /api/books
 * @group books - Operations about books
 * @param {string} title.query
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get("/", asyncMiddleware( async (req, res, next) => {
  let {themes, genres, authors, isFavorite} = req.query;
  const where = {};
  if(isFavorite==="true"){
    where.isFavorite = true;
  }
  themes = createWhere(themes);
  genres = createWhere(genres);
  authors = createWhere(authors);
  let books = await Book.findAll({
    where,
    include: [{
      model: Author,
      attributes: ["id"],
      where: authors,
      through: {
        attributes: []
      }
    },{
      model: Theme,
      attributes: ["name"],
      where: themes,
      through: {
        attributes: []
      }
    },{
      model: Genre,
      attributes: ["name"],
      where: genres,
      through: {
        attributes: []
      }
    }]
  });
  books = JSON.parse(JSON.stringify(books));
  for (let book of books){
    book.authors = mapToArray(book.authors, "id");
    if(book.themes) book.themes = mapToArray(book.themes, "name");
    if(book.genres) book.genres = mapToArray(book.genres, "name");
  }
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

router.get("/bestsellers", asyncMiddleware(async (req, res, next) => {
  const bookIds = await Reserve.findAll({
    limit: 10,
    attributes: ["bookId", [Sequelize.fn("count", Sequelize.col("bookId")), "count"]],
    group: "bookId",
    order: [
      [Sequelize.fn("count", Sequelize.col("bookId")), "DESC"]
    ]
  });
  res.json(bookIds);
}));

router.get("/:bookId", asyncMiddleware(async (req, res, next) => {
  const {bookId} = req.params;
  const book = await Book.findOne({
    where: {
      id: bookId
    },
    include: [{
      model: Author,
      attributes: ["id"],
      through: {
        attributes: []
      }
    },{
      model: Theme,
      attributes: ["name"],
      through: {
        attributes: []
      }
    },{
      model: Genre,
      attributes: ["name"],
      through: {
        attributes: []
      }
    }]
  });
  book.authors = mapToArray(book.authors, "id");
  if(book.themes) book.themes = mapToArray(book.themes, "name");
  if(book.genres) book.genres = mapToArray(book.genres, "name");
  res.json(book);
}));

module.exports = router;

function createWhere(str){
  const where = {};
  if(!str) return where;
  const arr = str.split(",");
  where.id = {
    [Op.in]: arr
  };
  return where;
}