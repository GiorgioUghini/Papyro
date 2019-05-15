let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Theme = require("../../models").theme;

router.get("/", asyncMiddleware(async (req, res, next) => {
  const themes = await Theme.findAll();
  res.json(themes);
}));

module.exports = router;