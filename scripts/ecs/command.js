const Core = require('./core');
const shell = require('shelljs');
const webpack = require('webpack');
const config = require('../../config');
const pkg = require('../../package.json');
const { EventEmitter } = require('events');
const childProcess = require('child_process');
const WebpackDevServer = require('webpack-dev-server');
const MainProcessWebpackConfig = require('./webpack/Main/webpack.config.js');
const RenderProcessWebpackConfig = require('./webpack/Render/webpack.config.js');
const net = require('net');

class Command extends EventEmitter {
  constructor() {
    super();
    this.AutoOpenApp = new Proxy(
      {
        _RenderProcessDone: false,
        _MainProcessDone: false
      },
      {
        set: (target, props, value) => {
          const isOk = Reflect.set(target, props, value);
          if (target._MainProcessDone && target._RenderProcessDone) {
            this.emit('openApp');
            this.emit('builddone');
          }
          return isOk;
        }
      }
    );
  }

  /** 检测端口占用 */
  portIsOccupied(port, callback) {
    const server = net.createServer().listen(port);
    server.on('listening', () => {
      server.close();
      callback(null, port);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        this.portIsOccupied(port + 1, callback);
      } else {
        callback(err);
      }
    });
  }

  /** Readme */
  childProcessExec(runPath) {
    const _childProcess = childProcess.exec(runPath);
    _childProcess.stdout.on('data', console.info);
    _childProcess.stdout.on('error', console.info);
    _childProcess.stderr.on('data', console.info);
    _childProcess.stderr.on('error', console.info);
  }

  /** Readme */
  async RenderProcess() {
    const compiler = webpack(RenderProcessWebpackConfig);
    compiler.hooks &&
      compiler.hooks.done.tapAsync({ name: 'CompiledRenderProcessOnce' }, (compilation, callback) => {
        if (!this.AutoOpenApp._RenderProcessDone) this.AutoOpenApp._RenderProcessDone = true;
        callback();
      });
    if (Core.isPro()) return compiler.run(Core.RenderProcessPro);
    const userDevServer = config.devServer || {};
    const devServerOptions = {
      hot: true,
      open: false,
      hotOnly: true,
      noInfo: true,
      stats: 'errors-only',
      clientLogLevel: 'error',
      overlay: { errors: true, warnings: true },
      ...userDevServer
    };

    this.portIsOccupied(config.port, (err, checkPort) => {
      new WebpackDevServer(compiler, devServerOptions).listen(checkPort + 1);
    });
  }

  /** Readme */
  async MainProcess() {
    const compiler = webpack(MainProcessWebpackConfig);
    compiler.hooks.done.tapAsync({ name: 'CompiledMainProcessOnce' }, (compilation, callback) => {
      if (!this.AutoOpenApp._MainProcessDone) this.AutoOpenApp._MainProcessDone = true;
      callback();
    });
    if (Core.isPro()) return compiler.run(Core.MainProcessPro);
    const watchOptions = { ignored: /(node_modules|Render|package\.json)/ };

    compiler.watch(watchOptions, Core.MainProcessDev);
  }

  /** Readme */
  build() {
    process.env.NODE_ENV = 'production';
    this.autoVersion();
    this.MainProcess();
    this.RenderProcess();
    this.once('builddone', () => {
      this.builder();
    });
  }

  /** Readme */
  builder() {
    switch (process.platform) {
      case 'win32':
        shell.exec('electron-builder --win --ia32');
        break;
      case 'darwin':
        shell.exec('electron-builder --mac --x64');
        break;
      case 'linux':
        shell.exec('electron-builder --linux');
        break;
      default:
        shell.exec('electron-builder --win --x64');
        break;
    }
  }

  /** Readme */
  start() {
    process.env.NODE_ENV = 'development';
    this.once('openApp', () => {
      this.app();
      if (config.tslint) this.childProcessExec(`tsc -w`);
    });
    this.MainProcess();
    this.RenderProcess();
  }

  /** Readme */
  help() {
    console.log(`
    Command:    node electron-cli-service

    Options:    [start, build, kill]
    `);
  }

  /** Readme */
  kill() {
    shell.exec(`taskkill /f /t /im electron.exe`);
    shell.exec(`taskkill /f /t /im ${pkg.build.productName}.exe`);
  }

  /** Readme */
  app() {
    if (config.nodemon) {
      this.childProcessExec(`nodemon -e js,ts,tsx -w dist -w package.json -w index.js --exec electron . --inspect`);
    } else {
      this.childProcessExec(`electron . --inspect`);
    }
  }

  /** Extends */
  autoVersion() {
    require('../run/auto-version');
  }

  /** Extends */
  autoService() {
    require('../run/auto-service');
  }
}

module.exports = Command;
