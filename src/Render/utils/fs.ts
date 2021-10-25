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
