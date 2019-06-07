const fs = require("fs");
const path = require("path");

const htmlFolder = path.join(__dirname, "..", "public", "pages");

module.exports = (req, res, next) => {
  res.sendHtml = (fileName) => {
    const html = fs.readFileSync(path.join(htmlFolder, fileName+".html"), "utf-8");
    res.send(html);
  };
  next();
};