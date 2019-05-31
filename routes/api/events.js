let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Event = require("../../models").event;
const Book = require("../../models").book;
const createError = require("http-errors");
const Op = require("../../models").Sequelize.Op;

router.get("/", asyncMiddleware( async (req, res, next) => {
  const where = {};
  let {startDate, endDate} = req.query;
  if(startDate){
    startDate = new Date(startDate);
    console.log(startDate.toDateString());
    where.date = {
      [Op.gte]: startDate
    }
  }
  if(endDate){
    endDate = new Date(endDate);
    console.log(endDate.toDateString());
    where.date[Op.lt] = endDate;
  }
  let events = await Event.findAll({
    where
  });
  res.json(events);
}));

router.post("/", asyncMiddleware( async (req, res, next) => {
  const book = await Book.findOne({where: {id: req.body.bookId}});
  if(!book) throw createError(404, "Book not found");
  const newEvent = await Event.create(req.body);
  await book.addEvent(newEvent);
  res.json({msg: "ok"});
}));

module.exports = router;