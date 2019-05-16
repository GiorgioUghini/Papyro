let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const lessMiddleware = require("less-middleware");
const cssbeautify = require("cssbeautify");
const swaggerOptions = require("./swagger");
const config = require("./config");

require("./models").initialize()
  .then(() => console.log("Database ready"))
  .catch((e) => console.error(e));

let app = express();
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(swaggerOptions);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'less'), {
  dest: path.join(__dirname, "public"),
  preprocess: {
    path: (pathname) => pathname.replace("/assets/css/", "/")
  },
  postprocess: {
    css: (css) => cssbeautify(css)
  }}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/ourbooks', require('./routes/ourbooks'));
app.use("/api/books", require("./routes/api/books"));
app.use("/api/authors", require("./routes/api/authors"));
app.use("/api/events", require("./routes/api/events"));
app.use("/api/genres", require("./routes/api/genres"));
app.use("/api/themes", require("./routes/api/themes"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/reservations", require("./routes/api/reservations"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'production' ? {} : err;

  // render the error page
  res.status(err.status || 500);
  if(req.path.startsWith("/api/")){
    res.json(res.locals.error);
  }else{
    res.render('error');
  }
});

module.exports = app;
