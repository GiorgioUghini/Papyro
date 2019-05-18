let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");

/* GET signin page. */
router.get('/', asyncMiddleware( async (req, res, next) => {
    res.render('signin', { title: 'Login' });
}));

module.exports = router;