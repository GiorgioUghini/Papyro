const fs = require("fs");
const path = require("path");

const htmlFolder = path.join(__dirname, "..", "public", "pages");
const indexFolder = path.join(htmlFolder, "..");

module.exports = (req, res, next) => {
  res.sendHtml = (fileName) => {
    const folder = fileName==="index.html" ? indexFolder : htmlFolder;
    const html = fs.readFileSync(path.join(folder, fileName+".html"), "utf-8");
    res.send(html);
  };
  next();
};