let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");

/* GET home page. */
router.get('/', asyncMiddleware( async (req, res) => {
  res.render('index', { title: 'Papyro' });
}));

router.get("/cart", asyncMiddleware(async (req, res) => {
  res.render("cart", {title: "Papyro"});
}));

router.get("/authors", asyncMiddleware(async (req, res) => {
  res.render("authors", { title: "Authors" })
}));

router.get("/ordering", asyncMiddleware(async (req, res) => {
  res.render("ordering", { title: "Ordering and Shipping Information" })
}));

router.get("/authors/:id", asyncMiddleware(async (req, res) => {
  res.render("author", {title: "Authors"});
}));

router.get("/events", asyncMiddleware(async (req, res) => {
  res.render("events", {title: "Events"});
}));

router.get("/events/:id", asyncMiddleware(async (req, res) => {
  res.render("event", { title: "Event" });
}));

module.exports = router;
