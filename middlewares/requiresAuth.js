const jwt = require('jsonwebtoken');
const createError = require("http-errors");
const {jwtSecret} = require("../config");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token) throw createError(401);
  const user = jwt.verify(token, jwtSecret);
  if(!user) throw createError(401);
  req.user = user;
  next();
};