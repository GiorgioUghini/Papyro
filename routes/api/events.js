let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Event = require("../../models").event;
const Book = require("../../models").book;
const mapToArray = require("../../utils");
const createError = require("http-errors");

router.get("/", asyncMiddleware( async (req, res, next) => {
  let events = await Event.findAll({
    include: [{
      model: Book,
      attributes: ["id"],
      through: {
        attributes: []
      }
    }]
  });
  events = JSON.parse(JSON.stringify(events));
  for (let event of events){
    event.books = mapToArray(event.books, "id");
  }
  res.json(events);
}));

router.post("/", asyncMiddleware( async (req, res, next) => {
  const book = await Book.findOne({where: {id: req.body.bookId}});
  if(!book) throw createError(404, "Book not found");
  const oldEvent = await book.getEvent();
  if(oldEvent) throw createError(409);
  const newEvent = await Event.create(req.body);
  await book.setEvent(newEvent);
  res.json({msg: "ok"});
}));

module.exports = router;