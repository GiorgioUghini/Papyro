const jwt = require('jsonwebtoken');
const createError = require("http-errors");
const {jwtSecret} = require("../config");

module.exports = (req, res, next) => {
  let auth = req.headers.authorization;
  if(!auth) throw createError(401);
  const token = /Bearer (.*)/.exec(auth)[1];
  if(!token) throw createError(401);
  const user = jwt.verify(token, jwtSecret);
  if(!user) throw createError(401);
  req.user = user;
  next();
};