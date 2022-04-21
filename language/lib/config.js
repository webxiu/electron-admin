const path = require("path");
const rootPath = process.cwd();
const srcPath = path.join(rootPath, "language");
const i18nPath = path.join(srcPath, "i18n");

const i18nJsPath = path.join(srcPath, "i18n.js");
const langJsonPaths = [
  { lang: "zh_CN", jsonPath: path.join(i18nPath, "zh_CN.json") },
  { lang: "en", jsonPath: path.join(i18nPath, "en.json") },
  { lang: "ru_RU", jsonPath: path.join(i18nPath, "ru_RU.json") }
]

module.exports = {
  rootPath,
  srcPath,
  i18nPath,
  i18nJsPath,
  langJsonPaths,
};
