/**
 * The return value of this method indicates whether or not this instance of your
 * application successfully obtained the lock.  If it failed to obtain the lock,
 * you can assume that another instance of your application is already running with
 * the lock and exit immediately.
 *
 * I.e. This method returns `true` if your process is the primary instance of your
 * application and your app should continue loading.  It returns `false` if your
 * process should immediately quit as it has sent its parameters to another
 * instance that has already acquired the lock.
 *
 * On macOS, the system enforces single instance automatically when users try to
 * open a second instance of your app in Finder, and the `open-file` and `open-url`
 * events will be emitted for that. However when users start your app in command
 * line, the system's single instance mechanism will be bypassed, and you have to
 * use this method to ensure single instance.
 *
 * An example of activating the window of primary instance when a second instance
 * starts:
 */

import { BrowserWindow, app } from 'electron';

import MountGlobal from './Global';
import _WorkPath from './Global/_WorkPath';

const child_process = require('child_process');
const path = require('path');

/**
 *
 * @单例锁
 * @Boolean true  []
 * @Boolean false [可以假设应用程序的另一个实例已经在]
 */
const gotTheLock = app.requestSingleInstanceLock();

const wakeOrCreate = () => {
  MountGlobal();
  /**
   * 当运行第二个实例时,将会聚焦到 {browserWindow} 这个窗口
   * 唤醒已启动的单例 {browserWindow}
   */
  app.on('second-instance', () => {
    const browserWindow: BrowserWindow | null = Reflect.get(global, 'CreateBrowserWindow') || null;
    if (!browserWindow) return;
    if (browserWindow.isMinimized()) browserWindow.restore();
    browserWindow.focus();
  });
  app.on('ready', function () {
    require('./DataBase/index');
    require('./Application');
  });

  let rootPath = path.join(__dirname, '../'); // 根目录
  let dirName = path.join(__dirname, '../server'); // 接口服务目录
  if (dirName.includes('app.asar') || dirName.includes('app')) {
    dirName = path.join(__dirname, '../../../server');
    rootPath = path.join(__dirname, '../../../');
  }
  Reflect.set($$, 'rootPath', rootPath);

  const voiceFiles = _WorkPath('voiceFiles');
  const localDBPath = _WorkPath('db');
  /** 请求接口语言设置 */
  const langStr = $$.language.replace(/-/, '_'); // 'zh-CN' 'en-US'
  const startLanguage = { zh_CN: 'zh', en_US: 'en' };

  // const testapp = child_process.spawn(path.join(rootPath, 'server/testapp.exe'), [
  //   '-addr',
  //   ':5002',
  //   '-db-path',
  //   path.join(localDBPath, './local.db'),
  //   '-file-path',
  //   voiceFiles,
  //   '-export-path',
  //   exportPath,
  //   '-log-path',
  //   path.join(localDBPath, './logs')
  // ]);

  // /** 启动算法服务 */
  // const guoyinlijian = child_process.spawn(
  //   path.join(dirName, 'guoyinlijian.exe'),
  //   [':5002', path.join(localDBPath, './local.db'), voiceFiles, path.join(localDBPath, './logs'), startLanguage[langStr]],
  //   { cwd: path.join(dirName) }
  // );

  // guoyinlijian.stdout.on('data', (data) => {
  //   console.log('guoyinlijian data:', data.toString());
  // });

  // guoyinlijian.on('close', (code) => {
  //   console.error('guoyinlijian log:', '服务关闭');
  //   guoyinlijian.kill('SIGTERM');
  // });
};

gotTheLock ? wakeOrCreate() : app.quit();
