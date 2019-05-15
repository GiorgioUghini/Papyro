let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Event = require("../../models").event;
const Book = require("../../models").book;
const {mapToArray} = require("../../utils");
const createError = require("http-errors");
const Op = require("../../models").Sequelize.Op;

router.get("/", asyncMiddleware( async (req, res, next) => {
  const where = {};
  const {startDate, endDate} = req.query;
  if(startDate){
    where.date = {
      [Op.gt]: startDate,
      [Op.lt]: endDate
    }
  }
  let events = await Event.findAll({
    where
  });
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