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
const langConfig = path.join(process.cwd(), 'language/config.conf');
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

/** 是否线上打包语言 */
const prodLang = process.env.PROD_LAN || process.env.LANGUAGE

// 根据环境变量修改build的nsis的向导语言installerLanguages
if (process.env.LANGUAGE) {
  const langObj = config.appConfig[prodLang]
  __PackageJson.build.nsis.installerLanguages = langObj.sysLang;
  __PackageJson.build.productName = langObj.appName || PackageJson.name;
  __PackageJson.build.win.icon = langObj.appIcon;
}
const localLangConf = { language: prodLang }

/** 选择语言打包, 并写入本地配置文件, 默认以打包语言启动 */
fs.writeFileSync(langConfig, JSON.stringify(localLangConf, null, 2), { encoding: 'utf-8' });
fs.writeFileSync(buildPackageFilePath, JSON.stringify(__PackageJson, null, 2), { encoding: 'utf-8' });
