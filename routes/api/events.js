let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const allowPosts = require("../../middlewares/allowPosts");
const Event = require("../../models").event;
const Book = require("../../models").book;
const createError = require("http-errors");
const Op = require("../../models").Sequelize.Op;

router.get("/", asyncMiddleware( async (req, res, next) => {
  const where = {};
  let {startDate, endDate} = req.query;
  if(startDate){
    if(isNaN(Date.parse(startDate))) throw createError(400, "Invalid value for start date param");
    startDate = new Date(startDate);
    where.date = {
      [Op.gte]: startDate
    }
  }
  if(endDate){
    if(isNaN(Date.parse(endDate))) throw createError(400, "Invalid value for end date param");
    endDate = new Date(endDate);
    if(!where.date) where.date = {};
    where.date[Op.lt] = endDate;
  }
  let events = await Event.findAll({
    where
  });
  if(!events.length) throw createError(404, "No events in this date range");
  res.json(events);
}));

router.get("/:id", asyncMiddleware(async (req, res, next) => {
  const id = req.params.id;
  if(isNaN(id)) throw createError(400, "Id must be an integer");
  if(!id) throw createError(400);
  const event = await Event.findOne({
    where: {
      id
    }
  });
  if(!event) throw(createError(404));
  res.json(event);
}));

router.post("/", allowPosts, asyncMiddleware( async (req, res, next) => {
  const book = await Book.findOne({where: {id: req.body.bookId}});
  if(!book) throw createError(404, "Book not found");
  const newEvent = await Event.create(req.body);
  await book.addEvent(newEvent);
  res.json({msg: "ok"});
}));

module.exports = router;