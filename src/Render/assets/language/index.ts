import Core from '~/scripts/ecs/core';
import fs from 'fs';
import path from 'path';

/** 读文件 */
export const readFile = (path: string) => {
  const data = fs.readFileSync(path);
  return data.toString();
};

/** 写文件 */
export const writeFile = (path: string, data: string) => {
  fs.writeFileSync(path, data, { encoding: 'utf-8' });
};

/**
 * 按文件夹分类, 返回文件列表
 * @param rootPath 入口目录,仅支持一层子目录(注意:不要在语言包内创建多层目录)
 * @returns {object} 按目录名为key, 值为目录下的文件列表
 */
export const getDirPaths = (rootPath: string) => {
  const dirObj: { [index: string]: string[] } = {};
  const findJsonFile = (dir: string) => {
    const files = fs.readdirSync(dir);
    files.forEach((name: string) => {
      const fPath: string = path.join(dir, name);
      const stat = fs.statSync(fPath);
      if (stat.isDirectory()) {
        dirObj[name] = [];
        findJsonFile(fPath);
      } else if (stat.isFile()) {
        const keys = Object.keys(dirObj);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const dirPath = path.parse(path.dirname(fPath));
          if (dirPath.name === key) {
            dirObj[key].push(fPath);
            break;
          }
        }
      }
    });
  };
  findJsonFile(rootPath);
  return dirObj;
};

/** 获取语言包文件目录 */
const getOutputDir = (lang: string) => {
  return path.join(process.cwd(), `language/i18n/${lang}.json`);
};

/** 读取语言词条, 保存到语言包文件 */
function generateLanguage() {
  const moreLangDir = path.join(process.cwd(), 'src/Render/assets/language');
  const pathsObj = getDirPaths(moreLangDir);
  Object.keys(pathsObj).forEach((key) => {
    const langData = {};
    const dirList = pathsObj[key];
    dirList.forEach((dir, idx) => {
      const langhtml = readFile(dir).toString();
      const langStr = langhtml.replace(/export default /, '').replace(';', '');
      const toObj = eval('(' + langStr + ')');
      langData[key] = { ...langData[key], ...toObj };

      if (idx === dirList.length - 1) {
        const outPath = getOutputDir(key);
        writeFile(outPath, JSON.stringify(langData[key], null, 2));
      }
    });
  });
}

if (!Core.isPro()) {
  generateLanguage();
}

/*
  const modulesFiles = require.context(`../`, true, /\.ts$/);
  const langObj = modulesFiles.keys().reduce((modules, src) => {
    console.log('modules', modules);
    return { ...modules, ...modulesFiles(src).default };
  }, {});
*/
