let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const authMiddleware = require("../../middlewares/requiresAuth");
const Reserve = require("../../models").reserve;
const Cart = require("../../models").cart;
const sequelize = require("../../models").Sequelize;
const {mapToArray} = require("../../utils");
const createError = require("http-errors");

router.get("/cart", authMiddleware, asyncMiddleware(async (req, res, next) => {
  const cart = await Cart.findAll({
    where: {
      userId: req.user.id
    }
  });
  const bookIds = mapToArray(cart, "bookId");
  res.json(bookIds);
}));

router.post("/addToCart", authMiddleware, asyncMiddleware(async (req, res, next) => {
  const {bookId} = req.body;
  if(!bookId) throw createError(400, "Missing book id");
  const userId = req.user.id;
  const result = await Cart.findOrCreate({
    where: {
      userId,
      bookId
    }
  });
  if(!result[1]) throw createError(409, "item already in the cart");
  res.json({msg: "ok"});
}));

router.post("/removeFromCart", authMiddleware, asyncMiddleware(async (req, res, next) => {
  const {bookId} = req.body;
  if(!bookId) throw createError(400, "Missing book id");
  const userId = req.user.id;
  const cartElement = await Cart.findOne({where: {bookId, userId}});
  if(!cartElement) throw createError(409, "Book was not in the cart");
  await cartElement.destroy();
  res.json({msg: "ok"});
}));

router.post("/confirmReservation", authMiddleware, asyncMiddleware(async (req, res, next) => {
  const userId = req.user.id;
  const cart = await Cart.findAll({where: {userId}});
  if(!(cart && cart.length)) throw createError(400, "Your Cart is empty");
  let maxReservationId = await Reserve.findAll({
      attributes: [[sequelize.fn('MAX', sequelize.col('reservationId')), 'maxReservationId']]
    });
  maxReservationId = maxReservationId[0].getDataValue("maxReservationId") || 0;
  for(let cartElement of cart){
    await Reserve.create({
      bookId: cartElement.bookId,
      userId,
      reservationId: maxReservationId+1
    });
    await cartElement.destroy();
  }
  res.json({msg: "ok"});
}));

module.exports = router;