const path = require('path');
const AntdTheme = require('./src/Render/assets/css/antd/theme.js');
const PackageJson = require('./package.json');
const __PackageJson = JSON.parse(JSON.stringify(PackageJson));
const language = __PackageJson.build.nsis.installerLanguages; //'zh-CN' 'en-US'

const JoinCwd = (...args) => {
  if (!args.length) {
    return process.cwd();
  }
  return path.join(process.cwd(), ...args);
};

module.exports = {
  /** 公共存储二级目录, 打包(zh_CN)和运行时(zh-CN)判断语言 */
  diskPath:
    (process.env.PROD_LAN || process.env.LANGUAGE || process.env.language) === 'zh_CN' || language === 'zh-CN'
      ? path.join('speakin', 'electron-admin')
      : path.join('MVAP', 'electron-admin_en'),
  /** 开发运行时 runtime */
  nodemon: true,

  /** 开发运行时 runtime */
  eslint: false,

  /** 开发运行时 runtime */
  tslint: true,

  /** speed-measure-webpack-plugin */
  smp: false,

  /** 主进程端口，开发环境渲染进程端口号 +=1 */
  port: 10120,

  entry: {
    renderProcess: 'src/Render/index.tsx',
    mainProcess: 'src/Main/index.ts'
  },

  antdTheme: AntdTheme,

  alias: {
    '~': JoinCwd(),
    '@': JoinCwd('src')
  },

  /** 日志保留天数 */
  logRetainDate: 7,

  output: 'dist',

  publicPath: '/',

  devServer: {
    after() { },
    before() { }
  },
  prefix: '/apis',
  hotUpdaterUri: 'http://118.24.173.102:10160',

  /** 多语言配置 与src/Render/routes/i18n.ts中resources配置的语言数目一致 */
  languages: {
    zh_CN: {
      //中文:打包名称
      appName: '海阔天空',
      //中文:打包语言
      appLang: 'zh-CN',
      //中文:打包图标
      appIcon: 'public/assets/favicon/png/favicon_ch@5x.png'
    },
    en: {
      appName: 'Sea And Sky',
      appLang: 'en-US',
      appIcon: 'public/assets/favicon/png/favicon_en@5x.png'
    }
  }
};
