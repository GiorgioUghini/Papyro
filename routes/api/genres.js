let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Genre = require("../../models").genre;

router.get("/", asyncMiddleware(async (req, res, next) => {
  const genres = await Genre.findAll();
  res.json(genres);
}));

module.exports = router;