const c = require("./config");
const utils = require("./utils");

function getI18nJsFile() {
  utils.createFolder(c.i18nPath);
  const i18nContent = `
  import * as electron from "electron";
  import * as fs from 'fs';
  import * as path from 'path';

  import { langJsonPaths } from './lib/config';

  const rootPath = electron.remote.app.isPackaged ? path.dirname(electron.remote.process.execPath) : electron.remote.app.getAppPath()
  const langPath = path.join(rootPath, 'language/config.conf')
  const langConf = JSON.parse(fs.readFileSync(langPath));
  const langConfig = langJsonPaths.find(item => item.lang === langConf.language)
  const language = (langConfig && langConfig.lang) || langJsonPaths[0].lang

  function i18n(lang) {
    let data;
    try {
      const langData = path.join(rootPath, \`language/i18n/\${lang}.json\`);
      if (fs.existsSync(langConf)) {
        const obj = JSON.parse(fs.readFileSync(langConf))
        if (langConf) lang = obj.language;
      }
  
      if (fs.existsSync(langData)) {
        const dataJson = JSON.parse(fs.readFileSync(langData));
        if (langData) data = dataJson;
      }
    } catch (e) {
      alert('语言包读取错误!')
      console.log('语言包读取错误:', e);
    }
  
    if (global) {
      global.$i18n = data;
      global.$language = lang;
    } else {
      window.$i18n = data;
      window.$language = lang;
    }
  };

  i18n(language)
  `;
  return i18nContent
}

function main() {
  utils.createFile(c.i18nJsPath, getI18nJsFile());
  // 创建语言包文件: (已经手动创建, 注释)
  c.langJsonPaths.forEach((item) => utils.createFile(item.jsonPath, "{}"));
}

module.exports = main;
