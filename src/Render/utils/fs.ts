import fs from 'fs';
import path from 'path';

export const readDirSync = (root, filter?, files?, prefix?) => {
  prefix = prefix || '';
  files = files || [];
  filter = filter || ((x) => x[0] !== '.');
  const dir = path.join(root, prefix);
  if (!fs.existsSync(dir)) return files;
  if (fs.statSync(dir).isDirectory())
    fs.readdirSync(dir)
      .filter(function (name, index) {
        return filter(name, index, dir);
      })
      .forEach(function (name) {
        readDirSync(root, filter, files, path.join(prefix, name));
      });
  else files.push(prefix);

  return files;
};

/** 同步递归创建文件夹, 返回文件夹目录 */
export const mkdirSync = (dirName) => {
  if (!dirName) throw new Error('目录不合法');
  if (fs.existsSync(dirName)) {
    return dirName;
  } else {
    if (mkdirSync(path.dirname(dirName))) {
      fs.mkdirSync(dirName);
      return dirName;
    }
  }
};

/**
 * @生成文件名
 * @param dir 用户选择目录
 * @param fileName 存储文件名 {不带后缀}
 * @param suffix 存储文件名后缀 如: .docx
 */
export const generateFilePath = (dir: string, fileName: string, suffix?: string): string => {
  suffix = suffix || '';
  const copyStr = '副本';
  let filePath = path.join(dir, `${fileName}${suffix}`);
  if (fs.existsSync(filePath)) {
    filePath = path.join(dir, `${fileName} - ${copyStr}${suffix}`);
    if (fs.existsSync(filePath)) {
      let pic = 0;
      while (fs.existsSync(filePath)) {
        pic += 1;
        filePath = path.join(dir, `${fileName} - ${copyStr}(${pic})${suffix}`);
      }
    }
  }
  return filePath;
};

/**
 * 读取文件
 */
export function readFile(path: string) {
  if (fs.existsSync(path)) {
    try {
      const buffer = fs.readFileSync(path);
      return buffer;
    } catch (e) {
      throw new Error('Error!');
    }
  }
  return undefined;
}
