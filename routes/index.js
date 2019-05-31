let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");

/* GET home page. */
router.get('/', asyncMiddleware( async (req, res, next) => {
  res.render('index', { title: 'Papyro' });
}));

router.get("/cart", asyncMiddleware(async (req, res, next) => {
  res.render("cart", {title: "Papyro"});
}));

router.get("/authors", asyncMiddleware(async (req, res, next) => {
  res.render("authors", { title: "Authors" })
}));

router.get("/authors/:id", asyncMiddleware(async (req, res, next) => {
  res.render("author", {title: "Authors"});
}));

router.get("/events", asyncMiddleware(async (req, res, next) => {
  res.render("events", {title: "Events"});
}));

module.exports = router;
