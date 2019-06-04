let express = require('express');
let router = express.Router();
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const User = require("../../models").user;
const ExpiredToken = require("../../models").expiredToken;
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../../config");
const bcrypt = require("bcrypt");
const authMiddleware = require("../../middlewares/requiresAuth");
const validator = require("email-validator");

router.post("/register", asyncMiddleware(async (req, res, next) => {
  const {email, password} = req.body;
  if(!(email && password)) throw createError(400, "Missing email or password");
  if(!validator.validate(email)) throw createError(400, "Invalid email");
  const user = await User.findOrCreate({
    where: {email},
    defaults: {password}});
  if(!user[1]) throw createError(409, "User already exists");
  res.json({msg: "ok"});
}));

router.post("/login", asyncMiddleware(async(req, res, next) => {
  const {email, password} = req.body;
  if(!(email && password)) throw createError(400);
  const user = await User.findOne({where: {email}});
  if(!user) throw createError(404, "User not found");
  if(!bcrypt.compareSync(password, user.password)) throw createError(401, "Wrong password");
  const token = jwt.sign({id: user.id, email}, jwtSecret);
  res.json({jwt: token});
}));

router.post("/logout", authMiddleware, asyncMiddleware(async (req, res, next) => {
  await ExpiredToken.create({token: req.user.token});
  res.json({msg:"ok"});
}));

module.exports = router;