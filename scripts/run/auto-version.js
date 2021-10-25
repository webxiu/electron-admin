/**
 * @打包号
 * 打包build号
 * 项目多名称配置打包
 * @打包号  process.env.BUILD_NUMBER jenkins 或者 webhooks 类 CI自动化打包 打包号码
 */
const fs = require('fs-extra');
const path = require('path');
let PackageJson = require('../../package.json');

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
  const lanMap = {
    zh_CN: 'zh-CN',
    en: 'en-US'
  };
  const appName = {
    zh_CN: '海阔天空',
    en: 'Sea And Sky'
  };
  const appWinIcon = {
    zh_CN: 'public/assets/favicon/png/favicon@5x.png',
    en: 'public/assets/favicon/png/favicon_en@5x.png'
  };
  __PackageJson.build.nsis.installerLanguages = lanMap[process.env.LANGUAGE];
  __PackageJson.build.productName = appName[process.env.LANGUAGE];
  __PackageJson.build.win.icon = appWinIcon[process.env.LANGUAGE];
}

fs.writeFileSync(buildPackageFilePath, JSON.stringify(__PackageJson, null, 2), { encoding: 'utf-8' });
