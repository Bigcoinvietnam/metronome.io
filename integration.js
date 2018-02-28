const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const STATIC_DIR = "./auction-build/static";
const JS_DIR = path.join(STATIC_DIR, "js");
const CSS_DIR = path.join(STATIC_DIR, "css");

const INDEX_HTML = "./index.html";

const getFileName = dir =>
  new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);

      files.forEach(file => {
        if (path.extname(file) === ".map") return;
        console.log("file founded: " + file);
        resolve(file);
      });
    });
  });

const readFile = dir =>
  new Promise((resolve, reject) =>
    fs.readFile(dir, (err, file) => {
      if (err) return reject(err);
      resolve(file);
    })
  );

const init = () => {
  const mainScript = getFileName(JS_DIR);
  const mainCSS = getFileName(CSS_DIR);
  const indexHTML = readFile(INDEX_HTML);

  return Promise.all([indexHTML, mainScript, mainCSS]);
};

init().then(([htmlFile, jsFile, cssFile]) => {
  const $ = cheerio.load(htmlFile.toString());

  const jsLink = `<script src="${path.join(JS_DIR, jsFile)}" />`;
  $("body").append(jsLink);

  const cssLink = `<link rel="stylesheet" href="${path.join(
    CSS_DIR,
    cssFile
  )}" />`;
  $("head").append(cssLink);

  const newIndex = $.html();
  fs.writeFile("./newIndex.html", newIndex, function(err) {
    if (err) {
      return console.log(err);
    }
  });
});
