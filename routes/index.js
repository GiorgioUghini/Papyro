let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");

/* GET home page. */
router.get('/', asyncMiddleware( async (req, res, next) => {
  res.render('index', { title: 'Express' });
}));

module.exports = router;
