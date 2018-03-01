const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const STATIC_DIR = "./auct-build/static";
const JS_DIR = path.join(STATIC_DIR, "js");
const CSS_DIR = path.join(STATIC_DIR, "css");

const INDEX_HTML = "./index.html";

// this is used to leave a mark for future removal in the next run of the script
const INTEGRATION_ID = "auct-brd-integration";

const ora = require('ora');
const spinner = ora('starting process...').start();

const getFileName = dir =>
  new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);

      files.forEach(file => {
        if (path.extname(file) === ".map") return;
        spinner.succeed("file found: " + file);
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
  spinner.text = 'searching files needed for the integration...'
  const mainScript = getFileName(JS_DIR);
  const mainCSS = getFileName(CSS_DIR);
  const indexHTML = readFile(INDEX_HTML);

  return Promise.all([indexHTML, mainScript, mainCSS]);
};

init().then(([htmlFile, jsFile, cssFile]) => {
  spinner.text = 'preparing html for change...'
  const $ = cheerio.load(htmlFile.toString())

  const res = $(`head link[id=${INTEGRATION_ID}]`).remove()
  const res2 = $(`body script[id=${INTEGRATION_ID}]`).remove()
  
  // creates new tags for the css and js
  spinner.text = 'creating new tags from last build...'
  const jsLink = `<script src="${path.join(
    JS_DIR,
    jsFile
  )}" id="${INTEGRATION_ID}"/>`;

  const cssLink = `<link rel="stylesheet" href="${path.join(
    CSS_DIR,
    cssFile
  )}" id="${INTEGRATION_ID}" />`;

  spinner.text = 'adding tags...'
  $("body").append(jsLink);
  $("head").append(cssLink);

  const newIndex = $.html();
  
  spinner.text = 'saving file...'
  fs.writeFile("./index.html", newIndex, function(err) {
    if (err) return spinner.fail(err)
    spinner.succeed('index.html updated')
    spinner.succeed('bye!')
  });
}).catch(err => spinner.fail(err));
