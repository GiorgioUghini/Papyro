let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const Review = require("../../models").review;
const Book = require("../../models").book;
const createError = require("http-errors");

router.get("/", asyncMiddleware(async (req, res, next) => {
    const reviews = await Review.findAll();
    res.json(reviews);
}));

router.get("/findByBookId/:bookId", asyncMiddleware(async (req, res, next) => {
    const {bookId} = req.params;
    if(isNaN(bookId)) throw createError(400, "Book id must be an integer");
    const reviews = await Review.findAll({
        where: {
            bookId
        }
    });
    if(!reviews.length) throw createError(404);
    res.json(reviews);
}));

router.get("/:id", asyncMiddleware(async (req, res, next) => {
    const {id} = req.params;
    if(isNaN(id)) throw createError(400, "Id must be an integer");
    const review = await Review.findOne({
        where: {id}
    });
    if(!review) throw createError(404);
    res.json(review);
}));

router.post("/", asyncMiddleware(async (req, res, next) => {
    const {bookId, name, comment} = req.body;
    if(!(bookId && name && comment)) throw createError(400, "All fields are mandatory");
    const book = await Book.findOne({where: {id: bookId}});
    if(!book) throw createError(404, "Book not found");
    const review = await Review.create({
        name,
        comment
    });
    await book.addReview(review);
    res.json({review});
}));

module.exports = router;