const pug = require("pug");
const path = require("path");
const fs = require("fs");

/**
 * @param arr an array in the form [{k: v1},{k, v2}] */
const mapToArray = (arr, field) => {
  return arr.map(x => x[field]);
};

const htmlPath = path.join(__dirname, "..", "public", "pages");

if(!fs.existsSync(htmlPath)){
  fs.mkdirSync(htmlPath);
}

const compilePug = () => {
  const pugPath = path.join(__dirname, "..", "views");
  const pugFiles = fs.readdirSync(pugPath).filter(f => (f.endsWith(".pug") && f!=="default.pug"));
  pugFiles.forEach(f => {
    const html = pug.renderFile(path.join(pugPath, f), { title: "Papyro" }, undefined);
    const htmlFileName = f.replace(".pug", ".html");
    let tmpPath = (htmlFileName==="index.html") ? path.join(htmlPath, "..") : htmlPath;
    fs.writeFileSync(path.join(tmpPath, htmlFileName), html);
  });
};

module.exports = {
  mapToArray,
  compilePug
};