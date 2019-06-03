let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Book = require("../../models").book;
const Author = require("../../models").author;
const Theme = require("../../models").theme;
const Genre = require("../../models").genre;
const Reserve = require("../../models").reserve;
const Event = require("../../models").event;
const Op = require("../../models").Sequelize.Op;
const Sequelize = require("../../models").Sequelize;
const {mapToArray} = require("../../utils");
const createError = require("http-errors");

router.get("/", asyncMiddleware( async (req, res, next) => {
  let {themes, genres, authors, isFavorite, bestSeller} = req.query;
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
      attributes: ["id", "name"],
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
  if(bestSeller==="true"){
    let bestSellers = await Reserve.findAll({
      limit: 10,
      attributes: ["bookId", [Sequelize.fn("count", Sequelize.col("bookId")), "count"]],
      group: "bookId",
      order: [
        [Sequelize.fn("count", Sequelize.col("bookId")), "DESC"]
      ]
    });
    bestSellers = bestSellers.map(x => x.bookId);
    books = books.filter(b => bestSellers.includes(b.id));
  }
  if(!books.length) throw createError(404);
  for (let book of books){
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

router.post("/similar", asyncMiddleware(async (req, res, next) => {
  const {id1, id2} = req.body;
  if(parseInt(id1)===parseInt(id2)) throw createError(400, "Ids cannot be identical");
  const book1 = await Book.findOne({
    where: {
      id: id1
    }
  });
  const book2 = await Book.findOne({
    where: {
      id: id2
    }
  });
  if(!(book1 && book2)) throw createError(404, "Book not found");
  await book1.addSimilar(book2);
  await book2.addSimilar(book1);
  res.json({msg: "ok"});
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
  let book = await Book.findOne({
    where: {
      id: bookId
    },
    include: [{
      model: Author,
      attributes: ["id", "name"],
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
    },{
      model: Event
    },{
      model: Book,
      as: "Similar",
      through:{
        attributes: []
      }
    }]
  });
  book = book.toJSON();
  if(book.themes) book.themes = mapToArray(book.themes, "name");
  if(book.genres) book.genres = mapToArray(book.genres, "name");
  res.json(book);
}));

module.exports = router;

function createWhere(str){
  const where = {};
  if(!str || str==="0") return where;
  const arr = str.split(",");
  where.id = {
    [Op.in]: arr
  };
  return where;
}