let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");

/* GET books page. */
router.get('/', asyncMiddleware( async (req, res, next) => {
    res.render('ourbooks', { title: 'Our books' });
}));

router.get("/:bookId", asyncMiddleware(async (req, res, next) => {
  res.render("singleBook", {
    title: "Papyro"
  })
}));

module.exports = router;
