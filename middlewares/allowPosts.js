const config = require("../config");
const createError = require("http-errors");

module.exports = (req, res, next) => {
  if(!config.allowPosts) return next(createError(401));
  next();
};