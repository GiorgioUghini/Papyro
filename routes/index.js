let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");

/* GET home page. */
router.get('/', asyncMiddleware( async (req, res) => {
  res.sendHtml('index');
}));

router.get("/cart", asyncMiddleware(async (req, res) => {
  res.sendHtml("cart");
}));

router.get("/authors", asyncMiddleware(async (req, res) => {
  res.sendHtml("authors")
}));

router.get("/ordering", asyncMiddleware(async (req, res) => {
  res.sendHtml("ordering")
}));

router.get("/authors/:id", asyncMiddleware(async (req, res) => {
  res.sendHtml("author");
}));

router.get("/events", asyncMiddleware(async (req, res) => {
  res.sendHtml("events", {title: "Events"});
}));

router.get("/events/:id", asyncMiddleware(async (req, res) => {
  res.sendHtml("event");
}));

router.get("/ourbooks", asyncMiddleware(async (req, res) => {
  res.sendHtml("ourbooks");
}));

router.get("/ourbooks/:id", asyncMiddleware(async (req, res) => {
  res.sendHtml("singleBook");
}));

router.get("/signin", asyncMiddleware(async (req, res) => {
  res.sendHtml("signin");
}));

router.get("/register", asyncMiddleware(async (req, res) => {
  res.sendHtml("register");
}));

module.exports = router;
