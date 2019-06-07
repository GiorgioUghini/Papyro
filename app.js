let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const lessMiddleware = require("less-middleware");
const sendHtml = require("./middlewares/sendHtml");
const cssbeautify = require("cssbeautify");
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const config = require("./config");
const {compilePug} = require("./utils");

const swaggerDocument = YAML.load("./swagger.yaml");
if(process.env.NODE_ENV !== "production") {
  swaggerDocument.servers[0].url = config.host + "/api";
}

require("./models").initialize()
  .then(() => console.log("Database ready"))
  .catch((e) => console.error(e));

compilePug();

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(sendHtml);
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
app.get("/backend/spec.yaml", (req, res) => res.send(YAML.stringify(swaggerDocument, 500)));
app.use('/backend/swaggerui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', require('./routes/index'));
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
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'production' ? {} : err;

  // render the error page
  res.status(err.status || 500);
  if(req.path.startsWith("/api/")){
    res.json(res.locals.error);
  }else{
    res.cookie("message", err.message);
    res.cookie("error", err);
    res.sendHtml("error");
  }
});

module.exports = app;
