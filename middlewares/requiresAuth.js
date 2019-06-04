const jwt = require('jsonwebtoken');
const createError = require("http-errors");
const {jwtSecret} = require("../config");
const ExpiredToken = require("../models").expiredToken;
const asyncMiddleware = require("./asyncMiddleware");

module.exports = asyncMiddleware(async (req, res, next) => {
  let auth = req.headers.authorization;
  if(!auth) throw createError(401);
  const token = auth.replace("Bearer ", "");
  if(!token) throw createError(401);
  const user = jwt.verify(token, jwtSecret);
  if(!user) throw createError(401, "Invalid token");
  const loggedOut = await ExpiredToken.findOne({where: {token}});
  if(loggedOut) throw createError(401, "This session is not valid anymore");
  req.user = user;
  req.user.token = token;
  next();
});