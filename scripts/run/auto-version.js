/**
 * @打包号
 * 打包build号
 * 项目多名称配置打包
 * @打包号  process.env.BUILD_NUMBER jenkins 或者 webhooks 类 CI自动化打包 打包号码
 */
const fs = require('fs-extra');
const path = require('path');
let PackageJson = require('../../package.json');
const config = require('../../config');

const buildPackageFilePath = path.join(process.cwd(), 'package.json');
const { BUILD_NUMBER } = process.env;

/**
 * @output ${清空目录 }
 */
fs.emptyDirSync(path.join(process.cwd(), 'output'));
let __PackageJson = JSON.parse(JSON.stringify(PackageJson));

/**
 * @服务器打包
 * @prebuild 配置打包软件名称，Build 号 写入 package.json
 */
if (BUILD_NUMBER) {
  /** 修改 软件打包名称添加版本号 xxx Setup version-build.xx */
  __PackageJson.version = `${__PackageJson.version}-${process.env.BUILD_NUMBER}`;
}

// 根据环境变量修改build的nsis的向导语言installerLanguages
if (process.env.LANGUAGE) {
  const languages = config.languages;
  const appConfig = languages[process.env.LANGUAGE];
  const { appLang, appName, appWinIcon } = appConfig;

  appLang && (__PackageJson.build.nsis.installerLanguages = appLang);
  appName && (__PackageJson.build.productName = appName);
  appWinIcon && (__PackageJson.build.win.icon = appWinIcon);
}

fs.writeFileSync(buildPackageFilePath, JSON.stringify(__PackageJson, null, 2), { encoding: 'utf-8' });
